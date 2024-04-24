import uuidv4 from "uuid";
import "../database/ChatDatabase";
import "../database/MessageDatabase";

import OpenAI from "openai";
import ChatDatabase from "../database/ChatDatabase";
import MessageDatabase from "../database/MessageDatabase";
require("dotenv").config();

const router = require("express").Router();
const OpenAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Authorize Incoming requests
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
    res.json(await ChatDatabase.fetchChats(req.oidc.user.sub, ".*"));
});

/**
 * Create a conversation
 * 
 * Expects a userId, nickname, and language in the post request body
 */
router.post("/", async (req, res) => {
    let result;
    try {
        result = await ChatDatabase.createChat(uuidv4(), req.oidc.user.sub, req.body.nickname, req.body.language);
    }
    catch (error) {
        res.status(422).send(error.message);
    }
    // Check if conversation already existed
    if (!result[1]) {
        res.status(409).send("Conversation already exists");
    }
    res.status(200).end();
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
        res.status(404).send("Conversation not found");
    }
    try {
        if (req.body.hasOwnProperty("nickname") && req.body.nickname !== conversation.nickname) {
            await conversation.setNickname(req.body.nickname);
        }
    }
    catch (error) {
        res.status(422).send(error.message);
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
        res.status(404).send("Conversation not found");
    }
    await conversation.delete();
    res.status(200).end();
});

/**
 * Get a response for a conversation
 * 
 * Refer to https://platform.openai.com/docs/guides/error-codes/api-errors for error codes
 */
router.post("/send", async (req, res, next) => {
    let completions;
    try {
        completions = await OpenAIClient.chat.completions.create({
            messages: req.body,
            model: "gpt-3.5-turbo"
        });
    }
    catch (error) {
        next(error);
    }
    res.json(completions.choices[0].message);
});

/**
 * Get the messages for a conversation
 */
router.get("/:conversationId/messages", async (req, res) => {
    res.json(await MessageDatabase.fetchMessages(req.oidc.user.sub, req.params.conversationId, ".*", false, false));
});

/**
 * Create a message
 * 
 * Expects arguments for chatId, role, and content in the post request body
 */
router.post("/message", async (req, res) => {
    let result;
    try {
        result = await MessageDatabase.createMessage(uuidv4(), req.body.chatId, req.body.content, req.body.role);
    }
    catch (error) {
        res.status(422).send(error.message);
    }
    // Check if message already existed
    if (!result[1]) {
        res.status(409).send("Message already exists");
    }
    res.status(200).end();
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
        res.status(404).send("Message not found");
    }
    try {
        if (req.body.hasOwnProperty("note") && req.body.note !== message.note) {
            await message.setNote(req.body.note);
        }
        if (req.body.hasOwnProperty("starred") && req.body.starred !== message.starred) {
            await message.setStarred(req.body.starred);
        }
        if (req.body.hasOwnProperty("content") && req.body.content !== message.content) {
            await message.setContent(req.body.content);
        }
    }
    catch (error) {
        res.status(422).send(error.message);
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
    // Check if message exists
    if (message === null) {
        res.status(404).send("Message not found");
    }
    await message.delete();
    res.status(200).end();
});

export default router;