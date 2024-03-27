import { Language } from "../types/Language";

class User {
    #databaseRecord: any;

    constructor(databaseRecord: any) {
        this.#databaseRecord = databaseRecord;
    }

    get firstName(): string {
        return this.#databaseRecord.firstName;
    }

    get lastName(): string {
        return this.#databaseRecord.lastName;
    }

    get userLanguage(): Language {
        return this.#databaseRecord.userLanguage;
    }

    get targetLanguages(): Language[] {
        return this.#databaseRecord.targetLanguages;
    }

    get userId(): string {
        return this.#databaseRecord.userId;
    }

    set firstName(newName: string) {
        if (newName.length === 0 || newName.length > 255) throw (new Error("Name length must be between 1 and 255"));
        this.#databaseRecord.firstName = newName;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving first name of " + this.#databaseRecord.userId, e) });
    }

    set lastName(newName: string) {
        if (newName.length === 0 || newName.length > 255) throw (new Error("Name length must be between 1 and 255"));
        this.#databaseRecord.lastName = newName;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving last name of " + this.#databaseRecord.userId, e) });
    }

    set userLanguage(newLanguage: Language) {
        this.#databaseRecord.userLanguage = newLanguage;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving UI language of " + this.#databaseRecord.userId, e) });
    }

    set targetLanguages(newLanguages: Language[]) {
        if (newLanguages.length === 0) throw new Error("Must set at least one target language");
        this.#databaseRecord.targetLanguages = newLanguages;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving target learning languages of " + this.#databaseRecord.userId, e) });
    }

    delete(): void {
        this.#databaseRecord.destroy().catch((e: Error) => { console.error("Error deleting " + this.#databaseRecord.userId, e) });
    }

    toJSON(): Object {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            userLanguage: this.userLanguage,
            targetLanguages: this.targetLanguages,
            userId: this.userId
        };
    }

    // fetchConversationHistory: post-MVP stretch goal

    // fetchNotes: post-MVP stretch goal
};

export default User;