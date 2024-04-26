import { Language } from "./Language";

class Message {
    private constructor(messageId: string, language: Language, note: string, starred: boolean, 
                        content: string, role: "system" | "assistant" | "user") {
        this.#messageId = messageId;
        this.#language = language;
        this.#note = note;
        this.#starred = starred;
        this.#content = content;
        this.#role = role;
    }

    private async updateMessage() {
        let response = await fetch("/api/chat/message", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                messageId: this.#messageId,
                note: this.#note,
                starred: this.#starred,
                content: this.#content
            })
        });
        
        if (response.status !== 200) {
            throw new Error(await response.text());
        }
    }

    static async fetchMessages(conversationId: string): Promise<Message[]> {
        let response = await fetch(`/api/chat/${conversationId}/messages`);
        if (response.status !== 200) {
            throw new Error(await response.text());
        }
        let messages = await response.json();
        return messages.map((message) => new Message(
            message.messageId,
            message.language,
            message.note,
            message.starred,
            message.content,
            message.role
        ));
    }

    static async createMessage(conversationId: string, content: string, role: "system" | "assistant" | "user") {
        let response = await fetch("/api/chat/message", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                chatId: conversationId,
                content: content,
                role: role
            })
        });

        if (response.status !== 200) {
            throw new Error(await response.text());
        }
    }

    async delete() {
        let response = await fetch("/api/chat/message", {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                messageId: this.#messageId
            })
        });

        if (response.status !== 200) {
            throw new Error(await response.text());
        }
    }

    async setNote(note: string) {
        this.#note = note;
        await this.updateMessage();
    }

    async setStarred(starred: boolean) {
        this.#starred = starred;
        await this.updateMessage();
    }

    async setContent(content: string) {
        this.#content = content;
        await this.updateMessage();
    }

    get messageId(): string {
        return this.#messageId;
    }

    get language(): Language {
        return this.#language;
    }

    get note(): string {
        return this.#note;
    }

    get starred(): boolean {
        return this.#starred;
    }

    get content(): string {
        return this.#content;
    }

    get role(): "system" | "assistant" | "user" {
        return this.#role;
    }

    #messageId: string;
    #language: Language;
    #note: string;
    #starred: boolean;
    #content: string;
    #role: "system" | "assistant" | "user";
};

export default Message;