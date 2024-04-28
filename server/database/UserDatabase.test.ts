import "dotenv/config";
import Database from "./Database";
import UserDatabase from "./UserDatabase";
import ChatDatabase from "./ChatDatabase";

beforeAll(async () => await Database.initialize());

afterAll(async () => await Database.close());

test("guards against unreasonable user data parameters during creation", async () => {
    await expect(() => UserDatabase.createUser("", "John", "Doe", "English", ["Spanish"])).rejects.toThrow("User Id cannot have 0 length");
    await expect(() => UserDatabase.createUser("animpossibleid", "", "Doe", "English", ["Spanish"])).rejects.toThrow("First name length must be between 0 and 255 characters long");
    await expect(() => UserDatabase.createUser("animpossibleid", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "Doe", "English", ["Spanish"])).rejects.toThrow("First name length must be between 0 and 255 characters long");
    await expect(() => UserDatabase.createUser("animpossibleid", "John", "", "English", ["Spanish"])).rejects.toThrow("Last name length must be between 0 and 255 characters long");
    await expect(() => UserDatabase.createUser("animpossibleid", "John", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "English", ["Spanish"])).rejects.toThrow("Last name length must be between 0 and 255 characters long");
    await expect(() => UserDatabase.createUser("animpossibleid", "John", "Doe", "English", [])).rejects.toThrow("User must have at least one target language");
});

test("create new user and verify its members are set correctly", async () => {
    let result = await UserDatabase.createUser("animpossibleid", "John", "Doe", "English", ["Spanish", "French"]);

    expect(result[1]).toBe(true);

    let user = result[0];

    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.userLanguage).toBe("English");
    expect(JSON.stringify(user.targetLanguages)).toBe(JSON.stringify(["Spanish", "French"]));
    expect(user.userId).toBe("animpossibleid");

    expect(JSON.stringify(user.toJSON())).toBe(JSON.stringify({ firstName: "John", lastName: "Doe", userLanguage: "English", targetLanguages: ["Spanish", "French"], userId: "animpossibleid" }));
});

test("create new user that already exists and verify overwriting didn't happen", async () => {
    let result = await UserDatabase.createUser("animpossibleid", "Jane", "Doe", "Spanish", ["Mandarin"]);

    expect(result[1]).toBe(false);

    let user = result[0];

    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.userLanguage).toBe("English");
    expect(JSON.stringify(user.targetLanguages)).toBe(JSON.stringify(["Spanish", "French"]));
    expect(user.userId).toBe("animpossibleid");

    expect(JSON.stringify(user.toJSON())).toBe(JSON.stringify({ firstName: "John", lastName: "Doe", userLanguage: "English", targetLanguages: ["Spanish", "French"], userId: "animpossibleid" }));
});

test("fetching user by id returns the correct user", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.userLanguage).toBe("English");
    expect(JSON.stringify(user.targetLanguages)).toBe(JSON.stringify(["Spanish", "French"]));
    expect(user.userId).toBe("animpossibleid");

    expect(JSON.stringify(user.toJSON())).toBe(JSON.stringify({ firstName: "John", lastName: "Doe", userLanguage: "English", targetLanguages: ["Spanish", "French"], userId: "animpossibleid" }));
});

test("null on nonexisting id", async () => {
    let user = await UserDatabase.fetchUser("nonexistent");

    expect(user).toBe(null);
});

test("guards against unreasonable user member modifications", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    await expect(() => user.setFirstName("")).rejects.toThrow("Name length must be between 1 and 255");
    await expect(() => user.setFirstName("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).rejects.toThrow("Name length must be between 1 and 255");
    await expect(() => user.setFirstName("")).rejects.toThrow("Name length must be between 1 and 255");
    await expect(() => user.setLastName("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).rejects.toThrow("Name length must be between 1 and 255");
    await expect(() => user.setTargetLanguages([])).rejects.toThrow("Must set at least one target language");
});

test("modifications persist", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    await user.setFirstName("Jane");
    await user.setLastName("Williams");
    await user.setUserLanguage("Mandarin");
    await user.setTargetLanguages(["Japanese"]);

    user = await UserDatabase.fetchUser("animpossibleid");

    expect(user.firstName).toBe("Jane");
    expect(user.lastName).toBe("Williams");
    expect(user.userLanguage).toBe("Mandarin");
    expect(JSON.stringify(user.targetLanguages)).toBe(JSON.stringify(["Japanese"]));

    expect(JSON.stringify(user.toJSON())).toBe(JSON.stringify({ firstName: "Jane", lastName: "Williams", userLanguage: "Mandarin", targetLanguages: ["Japanese"], userId: "animpossibleid" }));

});

test("deleting user", async () => {
    await ChatDatabase.createChat("achat", "animpossibleid", "a chat", "English");

    let user = await UserDatabase.fetchUser("animpossibleid");
    let chats = await ChatDatabase.fetchChats("animpossibleid");

    expect(chats.length).toBe(1);

    await user.delete();

    user = await UserDatabase.fetchUser("animpossibleid");
    chats = await ChatDatabase.fetchChats("animpossibleid");

    expect(user).toBe(null);
    expect(chats.length).toBe(0);
});