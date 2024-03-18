import OpenAI from "openai";
require("dotenv").config();

type MessageObject = OpenAI.Chat.Completions.ChatCompletionMessageParam;

class ChatSession {
  /**
   * Constructs a ChatSession object with a given message history
   *
   * @param messages The current message history of the session, with each message conforming to
   * the MessageObject type
   */
  constructor(messages: MessageObject[]) {
    this.#messageHistory = messages;
  }

  /**
   * Configures the chatbot behavior when responding to the conversation
   * 
   * @param configurationMessage A string containing instructions for the chatbot
   */
  configure(configurationMessage: string) {
    this.#messageHistory.unshift({ role: "system", content: configurationMessage });
  }

  /**
   * Updates message history but does not poll for a response yet
   *
   * @param message The message sent by the user
   */
  send(message: string) {
    this.#messageHistory.push({ role: "user", content: message });
  }

  /**
   * Asynchronously polls for a response to the current conversation
   *
   * @returns A promise pending on the response to the conversation
   */
  async receive(): Promise<string | null> {
    const completion = await ChatSession.#client.chat.completions.create({
      messages: this.#messageHistory,
      model: "gpt-3.5-turbo",
    });
    let message = completion.choices[0]["message"];
    this.#messageHistory.push(message);
    return message.content;
  }

  static #client: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Client for interfacing with the OpenAI API
  #messageHistory: MessageObject[] = []; // Stores the message history for a particular chat session

  // TODO: implement quota checking for future scaling
  // TODO: implement error case checking
};

export { MessageObject, ChatSession };