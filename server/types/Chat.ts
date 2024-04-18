import { Language } from "./Language";

class Chat {
    #databaseRecord: any;

    constructor(databaseRecord: any) {
        this.#databaseRecord = databaseRecord;
    }

    get chatId(): string {
        return this.#databaseRecord.chatId;
    }

    get userId(): string {
        return this.#databaseRecord.userId;
    }

    get language(): Language {
        return this.#databaseRecord.chatId;
    }

    async delete() {
        await this.#databaseRecord.destroy().catch((e: Error) => { console.error("Error deleting " + this.#databaseRecord.chatId, e) });
    }
}

export default Chat;