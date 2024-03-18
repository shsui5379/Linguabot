import { Language } from "../types/Language";

class User {
    #firstName: string;
    #lastName: string;
    #databaseRecord: any;
    #userLanguage: Language;
    #targetLanguages: Language[];
    #userId: string;

    constructor(databaseRecord: any) {
        this.#firstName = databaseRecord.firstName;
        this.#lastName = databaseRecord.lastName;
        this.#databaseRecord = databaseRecord;
        this.#userLanguage = databaseRecord.userLanaguge;
        this.#targetLanguages = databaseRecord.targetLanguages;
        this.#userId = databaseRecord.userId;
    }

    get firstName() {
        return this.#firstName;
    }

    get lastName() {
        return this.#lastName;
    }

    get userLanguage() {
        return this.#userLanguage;
    }

    get targetLanguages() {
        return this.#targetLanguages;
    }

    get userId() {
        return this.#userId;
    }

    set firstName(newName: string) {
        this.#firstName = newName;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving first name of " + this.#userId, e) });
    }

    set lastName(newName: string) {
        this.#lastName = newName;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving last name of " + this.#userId, e) });
    }

    set userLanguage(newLanguage: Language) {
        this.#userLanguage = newLanguage;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving UI language of " + this.#userId, e) });
    }

    set targetLanguage(newLanguages: Language[]) {
        this.#targetLanguages = newLanguages;
        this.#databaseRecord.save().catch((e: Error) => { console.error("Error saving target learning languages of " + this.#userId, e) });
    }

    delete(): void {
        this.#databaseRecord.destroy().catch((e: Error) => { console.error("Error deleting " + this.#userId, e) });
    }

    toJSON(): Object {
        return {
            firstName: this.#firstName,
            lastName: this.#lastName,
            userLanguage: this.#userLanguage,
            targetLanguages: this.#targetLanguages,
            userId: this.#userId
        };
    }

    // fetchConversationHistory: post-MVP stretch goal

    // fetchNotes: post-MVP stretch goal
};

export default User;