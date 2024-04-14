import { Language } from "./Language";

class Chat {
    #databaseRecord: any;

    constructor(databaseRecord: any) {
        this.#databaseRecord = databaseRecord;
    }

    get chatId(): string {
        return this.#databaseRecord.chatId;
    }

    setChatId(newId: string) {
        if (newId.length === 0) throw new Error("Chat ID cannot be empty");
        this.#databaseRecord.chatId = newId;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving chatId for chat ", this.#databaseRecord.chatId, e) });
    }

    get userId(): string {
        return this.#databaseRecord.userId;
    }

    setUserId(newId: string) {
        if (newId.length === 0) throw new Error("User ID cannot be empty");
        this.#databaseRecord.userId = newId;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving userId for chat ", this.#databaseRecord.chatId, e) });
    }

    get language(): Language {
        return this.#databaseRecord.chatId;
    }

    setLanguage(newLanguage: Language) {
        this.#databaseRecord.language = newLanguage;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving language for chat ", this.#databaseRecord.chatId, e) });
    }

    async delete() {
        await this.#databaseRecord.destroy().catch((e: Error) => { console.error("Error deleting " + this.#databaseRecord.chatId, e) });
    }
}

export default Chat;