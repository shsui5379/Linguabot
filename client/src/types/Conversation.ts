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

    let conversation = await response.json();
    let configurationMessage = `You are a conversational language partner. Your name is Linguabot. Only respond back to the user in ${language}. Do not ever respond back in another language even if the user switches language.`;
    let greetingMessage;
    switch(language) {
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
    let createdMessageHistory = [];
    createdMessageHistory.push(await Message.createMessage(conversation.chatId, configurationMessage, "system"));
    createdMessageHistory.push(await Message.createMessage(conversation.chatId, greetingMessage, "assistant"));
    return new Conversation(conversation.conversationId, conversation.language, conversation.nickname, createdMessageHistory);
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
      let completion = await response.json();
      this.#messages.push(await Message.createMessage(this.#conversationId, completion.content, "assistant"));
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