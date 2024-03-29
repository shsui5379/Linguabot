import { ChatMessage } from "../../../server/types/ChatMessage";

class ChatSession {
  /**
   * Constructs a ChatSession object with a given message history.
   *
   * @param messages The current message history of a session, with each message conforming to
   *                 the ChatMessage type. If it already contains a configuration message, then
   *                 the configurationMessage argument should be empty.
   * @param configurationMessage A configuration message for the chatbot
   */
  constructor(messages: ChatMessage[], configurationMessage: string = "") {
    if (configurationMessage.length !== 0)
      this.messageHistory = [{role: "system", content: configurationMessage}, ...messages];
    else
      this.messageHistory = [...messages];
  }

  /**
   * Configures the chatbot behavior when responding to a conversation
   * 
   * @param configurationMessage A string containing instructions for the chatbot
   */
  configure(configurationMessage: string) {
    if (this.messageHistory.length === 0)
      this.messageHistory.push({role: "system", content: configurationMessage});
    else if (this.messageHistory[0].role === "system")
      this.messageHistory[0].content = configurationMessage;
    else
      this.messageHistory.unshift({role: "system", content: configurationMessage});
  }

  /**
   * Sends a user message a conversation, but does not fetch a response yet
   *
   * @param message The message sent by the user
   */
  send(message: string) {
    this.messageHistory.push({ role: "user", content: message });
  }

  /**
   * Fetch a response for the messages comprising a conversation
   * 
   * @returns A promise pending on the bot response
   */
  async receive() {
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