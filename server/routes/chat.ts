import { v4 as uuidv4 } from "uuid";
import "../database/ChatDatabase";
import "../database/MessageDatabase";

import OpenAI from "openai";
import ChatDatabase from "../database/ChatDatabase";
import MessageDatabase from "../database/MessageDatabase";
import Message from "../types/Message";
const createHttpError = require("http-errors");
require("dotenv").config();

const router = require("express").Router();
const OpenAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Authorize incoming requests
 */
router.use((req, res, next) => {
    if (req.oidc.isAuthenticated()) {
        next();
    }
    else {
        res.status(401).send("Unauthorized access");
    }
});

/**
 * Fetch conversations for a user
 */
router.get("/", async (req, res) => {
    let language = req.query.language ?? ".*";
    let conversations = await ChatDatabase.fetchChats(req.oidc.user.sub, language);
    res.json(conversations.map((conversation) => conversation.toJSON()));
});

/**
 * Create a conversation
 *
 * Expects a nickname and language in the post request body. Returns information about the created conversation.
 */
router.post("/", async (req, res, next) => {
    let conversation;
    let retry = false;

    let count = (await ChatDatabase.fetchChats(req.oidc.user.sub)).length;

    if (count === 10) {
        return res.status(507).send("reached max chat limit");
    }

    do {
        try {
            conversation = await ChatDatabase.createChat(uuidv4(), req.oidc.user.sub, req.body.nickname, req.body.language);
            retry = false;
        }
        catch (error) {
            if (error.message === "Chat already exists in database") {
                retry = true;
            }
            else {
                next(createHttpError(400, error.message));
            }
        }
    } while (retry);

    let configurationMessage = `You are a conversational language partner. Your name is Linguabot. Only respond back to the user in ${req.body.language}. Do not ever respond back in another language even if the user switches languages. Keep your responses short and simple, at CEFR Level A1.`;
    let greetingMessage;
    switch (req.body.language) {
        case "English":
            greetingMessage = "Hello! I'm Linguabot, your personal conversational partner. What would you like to talk about today?";
            break;
        case "French":
            greetingMessage = "Bonjour! Je suis Linguabot, votre interlocuteur personnel. De quoi aimeriez-vous parler aujourd’hui?";
            break;
        case "Japanese":
            greetingMessage = "こんにちは！ あなたの個人的な会話パートナー、Linguabot です。今日は何について話したいですか?";
            break;
        case "Korean":
            greetingMessage = "안녕하세요! 너의 개인 대화 파트너 Linguabot입니다. 오늘은 어떤 이야기를 하고 싶으신가요?";
            break;
        case "Mandarin":
            greetingMessage = "你好！我是 Linguabot，你的私人对话伙伴。今天你想聊什么？";
            break;
        case "Spanish":
            greetingMessage = "¡Hola! Soy Linguabot, tu compañero de conversación personal. ¿De qué te gustaría hablar hoy?";
            break;
    }
    await createMessage(conversation.chatId, configurationMessage, "system", next);
    res.json({
        conversation: conversation,
        message: await createMessage(conversation.chatId, greetingMessage, "assistant", next)
    });
});

/**
 * Modify a conversation
 *
 * Expects a chatId and nickname in the patch request body
 */
router.patch("/", async (req, res) => {
    let conversation = await ChatDatabase.fetchChat(req.body.chatId);
    // Check if conversation was found
    if (conversation === null) {
        return res.status(404).send("Conversation not found").end();
    }
    // Ensure that the client is the owner of the conversation to be modified
    if (conversation.userId !== req.oidc.user.sub) {
        return res.status(401).send("Unauthorized access").end();
    }
    try {
        if (req.body.hasOwnProperty("nickname") && req.body.nickname !== conversation.nickname) {
            await conversation.setNickname(req.body.nickname);
        }
    }
    catch (error) {
        res.status(422).send(error.message).end();
    }
    res.status(200).end();
});

/**
 * Delete a conversation
 *
 * Expects a chatId in the delete request body
 */
router.delete("/", async (req, res) => {
    let conversation = await ChatDatabase.fetchChat(req.body.chatId);
    // Check if conversation exists
    if (conversation === null) {
        return res.status(404).send("Conversation not found").end();
    }
    // Ensure that the client is the owner of the conversation to be deleted
    if (conversation.userId !== req.oidc.user.sub) {
        return res.status(401).send("Unauthorized access").end();
    }

    let conversationsCount = (await ChatDatabase.fetchChats(req.oidc.user.sub)).length;

    if (conversationsCount === 1) {
        return res.status(406).send("Must have at least one chat open").end();
    }

    await conversation.delete();
    res.status(200).end();
});

/**
 * Generate a topic for a conversation
 *
 * Expects conversationId in the request body
 */
router.post("/generate-topic", async (req, res, next) => {
    // Check that the conversation exists and that it belongs to the client
    let conversation = await ChatDatabase.fetchChat(req.body.conversationId);
    if (conversation === null) {
        return res.status(404).send("No such conversation found").end();
    }
    if (conversation.userId !== req.oidc.user.sub) {
        return res.status(401).send("Unauthorized access").end();
    }

    // Fetch the messages for the conversation
    let messages = await MessageDatabase.fetchMessages(req.oidc.user.sub, req.body.conversationId, ".*", false, false);
    // Remove configuration prompt message before passing message history to generate a new topic
    let [, ...messagesWithoutConfig] = messages;
    // Fetch a random topic in the language of the chat
    let completions;
    try {
        completions = await OpenAIClient.chat.completions.create({
            messages: [
                { role: "system", content: `You only respond in ${conversation.language}. Keep your responses short and simple.` },
                ...messagesWithoutConfig.filter((message) => message.role === "assistant").map((message) => ({ role: message.role, content: message.content })),
                { role: "user", content: "Suggest a new topic that has not already been mentioned or talked about." }
            ],
            model: "gpt-3.5-turbo"
        });
    }
    catch (error) {
        next(error);
    }
    let message = await createMessage(req.body.conversationId, completions.choices[0].message.content, "assistant", next);
    res.json(message);
});

/**
 * Get a response for a conversation
 *
 * Expects a Chat ID, and returns the Message of response
 *
 * Refer to https://platform.openai.com/docs/guides/error-codes/api-errors for error codes
 */
router.post("/completions", async (req, res, next) => {
    let history = await MessageDatabase.fetchMessages(req.oidc.user.sub, req.body.chatId, ".*", false, false);

    if (history.length === 0) {
        return res.status(404).send("Chat not found").end();
    }

    let completions;
    try {
        completions = await OpenAIClient.chat.completions.create({
            messages: history.map((message) => {
                return {
                    role: message.role,
                    content: message.content
                }
            }),
            model: "gpt-3.5-turbo"
        });
    }
    catch (error) {
        next(error);
    }
    let response = await createMessage(req.body.chatId, completions.choices[0].message.content, completions.choices[0].message.role, next);
    res.json(response.toJSON()).end();
});

/**
 * Get the messages for a conversation
 */
router.get("/:conversationId/messages", async (req, res) => {
    // Determine whether the request is a single chat message retrieval or a retrieval of every message
    if (req.params.conversationId === "all") {
        let mustHaveStar = req.query.starred ?? false;
        let sortByLastModified = req.query.sortByLastModified ?? false;
        let language = req.query.language ?? ".*";
        let messages = await MessageDatabase.fetchMessages(req.oidc.user.sub, ".*", language, mustHaveStar, false, sortByLastModified);
        // Filter out configuration messages so that they aren't sent
        res.json(messages.filter((message) => message.role !== "system").map((message) => message.toJSON()));
    }
    // Handle the case of message retrieval for a single chat
    else {
        // Check that the conversation exists and that it belongs to the client
        let conversation = await ChatDatabase.fetchChat(req.params.conversationId);
        if (conversation === null) {
            return res.status(404).send("No such conversation found").end();
        }
        if (conversation.userId !== req.oidc.user.sub) {
            return res.status(401).send("Unauthorized access").end();
        }
        let mustHaveStar = req.query.starred ?? false;
        let messages = await MessageDatabase.fetchMessages(req.oidc.user.sub, req.params.conversationId, ".*", mustHaveStar, false);
        // Remove configuration message and prevent it from being sent
        messages.shift();
        res.json(messages.map((message) => message.toJSON()));
    }
});

/**
 * Create a message
 *
 * Expects arguments for chatId, and content in the post request body. Returns information about the created message.
 * Role is always user.
 */
router.post("/message", async (req, res, next) => {
    // Check that the corresponding conversation both exists and belongs to the client
    let conversation = await ChatDatabase.fetchChat(req.body.chatId);
    if (conversation === null) {
        return res.status(404).send("No such conversation found").end();
    }
    if (conversation.userId !== req.oidc.user.sub) {
        return res.status(401).send("Unauthorized access").end();
    }
    res.json(await createMessage(req.body.chatId, req.body.content, "user", next));
});

/**
 * Modify a message
 *
 * Expects arguments for messageId, note, starred, and content in the patch request body
 */
router.patch("/message", async (req, res) => {
    let message = await MessageDatabase.fetchMessage(req.body.messageId);
    // Check if message was found
    if (message === null) {
        return res.status(404).send("Message not found").end();
    }
    // Check that message belongs to the client
    try {
        if (await message.getUserId() !== req.oidc.user.sub) {
            return res.status(401).send("Unauthorized access").end();
        }
    }
    catch (error) {
        return res.status(404).send(error.message).end();
    }
    // Proceed with message modifications
    try {
        if (req.body.hasOwnProperty("note") && req.body.note !== message.note) {
            await message.setNote(req.body.note.substring(0, 1024));
        }
        if (req.body.hasOwnProperty("starred") && req.body.starred !== message.starred) {
            await message.setStarred(req.body.starred);
        }
        if (req.body.hasOwnProperty("content") && req.body.content !== message.content) {
            if (message.role !== "user") {
                return res.status(403).send("Cannot update content of non-user message").end();
            }

            await message.setContent(req.body.content.substring(0, 1024));
        }
    }
    catch (error) {
        res.status(422).send(error.message).end();
    }
    res.status(200).end();
});

/**
 * Delete a message
 *
 * Expects a messageId in the delete request body
 */
router.delete("/message", async (req, res) => {
    let message = await MessageDatabase.fetchMessage(req.body.messageId);
    // Check if message was found
    if (message === null) {
        return res.status(404).send("Message not found").end();
    }
    // Check that message belongs to the client
    try {
        if (await message.getUserId() !== req.oidc.user.sub) {
            return res.status(401).send("Unauthorized access").end();
        }
    }
    catch (error) {
        return res.status(404).send(error.message).end();
    }

    if (message.role !== "user") {
        return res.status(403).send("Cannot delete non-user message").end();
    }

    // Proceed with message deletion
    await message.delete();
    res.status(200).end();
});

async function createMessage(chatId: string, content: string, role: "system" | "assistant" | "user", next) {
    let message;
    let retry = false;
    do {
        try {
            message = await MessageDatabase.createMessage(uuidv4(), chatId, content.substring(0, 1024), role);
            retry = false;
        }
        catch (error) {
            if (error.message === "Message ID collision") {
                retry = true;
            }
            else {
                next(createHttpError(400, error.message));
            }
        }
    } while (retry);
    return message;
}

router.post("/translate", async (req, res, next) => {
    const supportedLanguage = ["es", "ko", "ja", "en", "zh", "fr"];

    if (!supportedLanguage.includes(req.body.source) || !supportedLanguage.includes(req.body.target)) {
        return res.status(422).send("Unsupported language").end()
    }

    let completions;
    try {
        completions = await OpenAIClient.chat.completions.create({
            messages: [
                { role: "system", content: `Translate the following text from ${req.body.source} to ${req.body.target}` },
                { role: "user", content: req.body.text }
            ],
            model: "gpt-3.5-turbo"
        });
    }
    catch (error) {
        next(error);
    }
    res.send(completions.choices[0].message.content).end();
});

export default router;