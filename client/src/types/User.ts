import { Language } from "./Language";

class User {
    #userId: string;
    #firstName: string;
    #lastName: string;
    #userLanguage: Language;
    #targetLanguages: Language[];

    private constructor(userId: string, firstName: string, lastName: string, userLanguage: Language, targetLanguages: Language[]) {
        this.#userId = userId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#userLanguage = userLanguage;
        this.#targetLanguages = targetLanguages;
    }

    static async fetchUser(): Promise<User> {
        let response = await fetch("/api/user", {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            "redirect": "follow",
            referrerPolicy: "no-referrer",
        });

        if (response.status === 404 || response.status === 422) {
            throw new Error("User doesn't exist");
        }

        let data = await response.json();

        return new User(data.userId, data.firstName, data.lastName, data.userLanguage, JSON.parse(data.targetLanguages));
    }

    static async createUser(firstName: string, lastName: string, userLanguage: Language, targetLanguages: Language[]): Promise<User> {
        if (firstName.length === 0 || firstName.length > 255) {
            throw new Error("First name length must be between 1 and 255");
        }
        if (lastName.length === 0 || lastName.length > 255) {
            throw new Error("Last name length must be between 1 and 255");
        }
        if (targetLanguages.length === 0) {
            throw new Error("There must be at least 1 target language");
        }

        let response = await fetch("/api/user", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            "redirect": "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                userLanguage: userLanguage,
                targetLanguages: targetLanguages
            })
        });

        let data = await response.json();

        if (response.status === 422) {
            throw new Error(data.error);
        }

        return new User(data.userId, data.firstName, data.lastName, data.userLanguage, JSON.parse(data.targetLanguages));
    }

    private async updateUser() {
        if (this.#firstName.length === 0 || this.#firstName.length > 255) {
            throw new Error("First name length must be between 1 and 255");
        }
        if (this.#lastName.length === 0 || this.#lastName.length > 255) {
            throw new Error("Last name length must be between 1 and 255");
        }
        if (this.#targetLanguages.length === 0) {
            throw new Error("There must be at least 1 target language");
        }

        let response = await fetch("/api/user", {
            method: "PATCH",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            "redirect": "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                firstName: this.#firstName,
                lastName: this.#lastName,
                userLanguage: this.#userLanguage,
                targetLanguages: this.#targetLanguages
            })
        });

        let data = await response.json();

        if (response.status === 422 || response.status === 404) {
            throw new Error(data.error);
        }
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

    async setFirstName(newName: string) {
        if (newName.length === 0 || newName.length > 255) {
            throw new Error("Name must be between 1-255 length");
        }

        this.#firstName = newName;
        await this.updateUser();
    }

    async setLastName(newName: string) {
        if (newName.length === 0 || newName.length > 255) {
            throw new Error("Name must be between 1-255 length");
        }

        this.#lastName = newName;
        await this.updateUser();
    }

    async setUserLanguage(newLanguage: Language) {
        this.#userLanguage = newLanguage;
        await this.updateUser();
    }

    async setTargetLanguages(newLanguages: Language[]) {
        if (newLanguages.length === 0) {
            throw new Error("Must have at least 1 target language");
        }

        this.#targetLanguages = newLanguages;
        await this.updateUser();
    }

    async delete() {
        let response = await fetch("/api/user", {
            method: "DELETE",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            "redirect": "follow",
            referrerPolicy: "no-referrer"
        });

        if (response.status === 404) {
            throw new Error("User not found");
        }
    }
};

export default User;