import { ChatMessage } from "../../../server/types/ChatMessage";

class ChatSession {
  /**
   * Constructs a ChatSession object with a given message history
   *
   * @param messages The current message history of the session, with each message conforming to
   *                 the MessageObject type
   * @param configurationMessage The configuration message to initialize the bot with
   */
  constructor(messages: ChatMessage[] = [], configurationMessage: string = "") {
    this.messageHistory = messages;
    if (this.messageHistory.length !== 0 && this.messageHistory[0].role === "system")
      this.messageHistory[0].content = configurationMessage;
    else
      this.messageHistory.unshift({role: "system", content: configurationMessage});
  }

  /**
   * Configures the chatbot behavior when responding to the conversation
   * 
   * @param configurationMessage A string containing instructions for the chatbot
   */
  configure(configurationMessage: string) {
    this.messageHistory[0].content = configurationMessage;
  }

  /**
   * Sends a message and returns the chatbot response back
   *
   * @param message The message sent by the user
   * @returns A promise pending on the chatbot response
   */
  async send(message: string) {
    this.messageHistory.push({ role: "user", content: message });
    let response = await fetch("/api/chat/send", {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.messageHistory)
    });
    let data: ChatMessage = await response.json();
    this.messageHistory.push(data);
    return data.content;
  }

  messageHistory: ChatMessage[];
};

export { type ChatMessage, ChatSession };