import { Language } from "./Language";
import Message from "./Message";

class Conversation {
  private constructor(conversationId: string, language: Language, nickname: string, messages: Message[]) {
    this.#conversationId = conversationId;
    this.#language = language;
    this.#nickname = nickname;
    this.#messages = [...messages];
  }

  private async updateConversation() {
    let response = await fetch("/api/chat", {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        chatId: this.#conversationId,
        nickname: this.#nickname
      })
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
  }

  static async fetchConversations(): Promise<Conversation[]> {
    let response = await fetch("/api/chat");
    let conversations = await response.json();
    let results = [];
    for (const conversation of conversations) {
      let messages;
      try {
        messages = await Message.fetchMessages(conversation.chatId);
      }
      catch (error) {
        console.error(error.message);
      }
      results.push(new Conversation(conversation.chatId, conversation.language, conversation.nickname, messages))
    }
    return results;
  }

  static async createConversation(language: Language, nickname: string) {
    let response = await fetch("/api/chat/", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        language: language,
        nickname: nickname
      })
    });

    if (response.status !== 200) {
      throw new Error(await response.text());
    }
  }

  async configure(configurationMessage: string) {
    if (configurationMessage.length === 0) {
      throw new Error("Configuration message must not be empty");
    }

    try {
      if (this.#messages.length === 0) {
        await Message.createMessage(this.#conversationId, configurationMessage, "system");
        this.#messages = await Message.fetchMessages(this.#conversationId);
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
      await Message.createMessage(this.#conversationId, message, "user");
      this.#messages = await Message.fetchMessages(this.#conversationId);
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async receive() {
    let response = await fetch("/api/chat/completions", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.#messages.map((message) => {
        return {
          role: message.role,
          content: message.content
        };
      }))
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

    try {
      await Message.createMessage(this.#conversationId, await response.json(), "assistant");
      this.#messages = await Message.fetchMessages(this.#conversationId);
    }
    catch (error) {
      console.error(error.message);
    }
  }

  async delete() {
    let response = await fetch("/api/chat/", {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
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

  #conversationId: string;
  #language: Language;
  #nickname: string;
  #messages: Message[];
};

export default Conversation;