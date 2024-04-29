import { Language } from "./Language";

class Message {
    #databaseRecord: any;

    constructor(record) {
        this.#databaseRecord = record;
    }

    get chatId(): string {
        return this.#databaseRecord.chatId;
    }

    get messageId(): string {
        return this.#databaseRecord.messageId;
    }

    async getLanguage(): Promise<Language> {
        let chat;

        try {
            chat = await this.#databaseRecord.getChatDatabase();
        } catch (error) {
            throw new Error("Failed to look up Chat details: " + error.message);
        }

        return chat.language as Language;
    }

    async getUserId(): Promise<string> {
        let chat;

        try {
            chat = await this.#databaseRecord.getChatDatabase();
        } catch (error) {
            throw new Error("Failed to look up Chat details: " + error.message);
        }

        return chat.userId;
    }

    get note(): string | null {
        return this.#databaseRecord.note;
    }

    async setNote(newNote: string) {
        if (newNote.length > 1024) throw new Error("Max note length is 1024 characters");

        if (newNote == "") {
            this.#databaseRecord.note = null;
        } else {
            this.#databaseRecord.note = newNote;
        }

        await this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving note of " + this.#databaseRecord.messageId, e) });
    }

    get starred(): boolean {
        return this.#databaseRecord.starred;
    }

    async setStarred(newStatus: boolean) {
        this.#databaseRecord.starred = newStatus;

        await this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving starred status of " + this.#databaseRecord.messageId, e) });
    }

    get content(): string {
        return this.#databaseRecord.content;
    }

    async setContent(newContent: string) {
        if (newContent.length === 0 || newContent.length > 1024) {
            throw new Error("Message content length needs to be 1-1024 characters long");
        }

        this.#databaseRecord.content = newContent;
        await this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving content of " + this.#databaseRecord.messageId, e) });

    }

    get role(): "assistant" | "user" | "system" {
        return this.#databaseRecord.role;
    }

    get timestamp(): number {
        return this.#databaseRecord.timestamp;
    }

    async delete() {
        await this.#databaseRecord.destroy().catch((e: Error) => { console.error("Error deleting message" + this.#databaseRecord.messageId, e) });
    }

    toJSON() {
        return {
            chatId: this.chatId,
            messageId: this.messageId,
            note: this.note,
            starred: this.starred,
            content: this.content,
            role: this.role,
            timestamp: this.timestamp
        };
    }
}

export default Message;