import { ConversationMessage } from "../../../server/types/ConversationMessage";

class Conversation {
  /**
   * Constructs a Conversation object with a given message history and configuration message.
   *
   * @param messages The current message history of a conversation. If it already contains a 
   *                 configuration message, then the configurationMessage argument will be ignored.
   * @param configurationMessage A configuration message for the chatbot
   */
  constructor(messages: ConversationMessage[], configurationMessage: string = "") {
    if (configurationMessage.length !== 0) {
      this.#messageHistory = [{role: "system", content: configurationMessage}, ...messages];
    }
    else {
      this.#messageHistory = [...messages];
    }
  }

  /**
   * Configures the chatbot for a conversation
   * 
   * @param configurationMessage A configuration message for the chatbot
   */
  configure(configurationMessage: string) {
    if (configurationMessage.length !== 0) {
      this.#messageHistory[0].content = configurationMessage;
    }
  }

  /**
   * Sends a user message in a conversation, but does not fetch a response yet
   *
   * @param message The message sent by the user
   */
  send(message: string) {
    this.#messageHistory.push({role: "user", content: message});
  }

  /**
   * Asynchronously fetches a response for the conversation
   * 
   * @returns A promise pending on the bot response
   */
  async receive() {
    let response = await fetch("/api/chat/send", {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.#messageHistory)
    });

    switch(response.status) {
      case 401:
        throw new Error("Unauthorized OpenAI access");
      case 403:
        throw new Error("Accessing OpenAI from an unsupported country, region, or territory");
      case 429:
        throw new Error("OpenAI quota limits");
      case 500:
        throw new Error("OpenAI servers experiencing issues");
      case 503:
        throw new Error("OpenAI servers overloaded");
    }

    this.#messageHistory.push(await response.json());
  }

  get messageHistory() {
    return this.#messageHistory;
  }

  #messageHistory: ConversationMessage[];
};

export { type ConversationMessage, Conversation };