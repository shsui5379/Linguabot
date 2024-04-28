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
        return this.#databaseRecord.language;
    }

    get nickname(): string {
        return this.#databaseRecord.nickname;
    }

    async setNickname(newNickname: string) {
        if (newNickname.length === 0 || newNickname.length > 255) throw new Error("Nickname needs to be between 1-255 characters long");

        this.#databaseRecord.nickname = newNickname;

        await this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving nickname of chat " + this.#databaseRecord.chatId, e) });
    }

    get timestamp(): number {
        return this.#databaseRecord.timestamp
    }

    async delete() {
        await this.#databaseRecord.destroy().catch((e: Error) => { console.error("Error deleting " + this.#databaseRecord.chatId, e) });
    }
}

export default Chat;