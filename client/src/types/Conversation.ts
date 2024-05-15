import { Language } from "./Language";
import Message from "./Message";

class Conversation {
  private static Message = Message;
  private constructor(conversationId: string, language: Language, nickname: string, messages: Message[], timestamp: number) {
    this.#conversationId = conversationId;
    this.#language = language;
    this.#nickname = nickname;
    this.#messages = [...messages];
    this.#timestamp = timestamp;
  }

  private async updateConversation() {
    let response = await fetch("/api/chat", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: this.#conversationId,
        nickname: this.#nickname
      })
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
  }

  static async fetchConversations(language: Language | ".*" = ".*", onlyStarredMessages: boolean = false): Promise<Conversation[]> {
    let query = `?language=${language}`;
    let response = await fetch(`/api/chat${query}`);
    let conversations = await response.json();
    let results = [];
    for (const conversation of conversations) {
      let messages;
      try {
        messages = await Message.fetchMessages(conversation.chatId, onlyStarredMessages);
      }
      catch (error) {
        console.error(error.message);
      }
      results.push(new Conversation(conversation.chatId, conversation.language, conversation.nickname, messages, conversation.timestamp));
    }
    return results;
  }

  static async createConversation(language: Language, nickname: string) {
    let response = await fetch("/api/chat/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: language,
        nickname: nickname
      })
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }

    let { conversation, message } = await response.json();
    return new Conversation(
      conversation.chatId,
      conversation.language,
      conversation.nickname,
      [new Conversation.Message(message.messageId, message.note, message.starred, message.content, message.role, message.timestamp)],
      conversation.timestamp
    );
  }

  async configure(configurationMessage: string) {
    if (configurationMessage.length === 0) {
      throw new Error("Configuration message must not be empty");
    }

    try {
      if (this.#messages.length === 0) {
        this.#messages.push(await Message.createMessage(this.#conversationId, configurationMessage, "system"));
      }
      else {
        await this.#messages[0].setContent(configurationMessage);
      }
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async send(message: string) {
    try {
      this.#messages.push(await Message.createMessage(this.#conversationId, message, "user"));
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async receive() {
    let response = await fetch("/api/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: this.#conversationId
      })
    });

    switch (response.status) {
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

    try {
      let completion = await response.json();
      this.#messages.push(new Message(completion.messageId, completion.note, completion.starred, completion.content, completion.role, completion.timestamp));
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async generateTopic() {
    let response = await fetch("/api/chat/generate-topic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: this.#conversationId,
        disallowedTopics: this.#disallowedTopics
      })
    });

    if (response.status !== 200) {
      console.error(await response.text());
    }

    let { message, topic } = await response.json();
    this.#messages.push(new Message(message.messageId, message.note, message.starred, message.content, message.role, message.timestamp));
    this.#disallowedTopics.push(topic);
  }

  async delete() {
    let response = await fetch("/api/chat/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: this.#conversationId
      })
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
  }

  async setNickname(nickname: string) {
    try {
      this.#nickname = nickname;
      await this.updateConversation();
    }
    catch (error) {

    }
  }

  get conversationId(): string {
    return this.#conversationId;
  }

  get language(): Language {
    return this.#language;
  }

  get nickname(): string {
    return this.#nickname;
  }

  get messages(): Message[] {
    return this.#messages;
  }

  get timestamp(): number {
    return this.#timestamp;
  }

  #conversationId: string;
  #language: Language;
  #nickname: string;
  #messages: Message[];
  #disallowedTopics: string[] = [];
  #timestamp: number;
};

export default Conversation;