import "dotenv/config";
import UserDatabase from "./UserDatabase";
import { rejects } from "assert";

beforeAll(async () => await UserDatabase.initialize());

afterAll(async () => await UserDatabase.close());

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

    expect(result[1] === true);

    let user = result[0];

    expect(user.firstName === "John");
    expect(user.lastName === "Doe");
    expect(user.userLanguage === "English");
    expect(JSON.stringify(user.targetLanguages) === JSON.stringify(["Spanish", "French"]));
    expect(user.userId === "animpossibleid");

    expect(JSON.stringify(user.toJSON()) === JSON.stringify({ firstName: "John", lastName: "Doe", userLanguage: "English", targetLanguages: ["Spanish", "French"], userId: "animpossibleid" }));
});

test("create new user that already exists and verify overwriting didn't happen", async () => {
    let result = await UserDatabase.createUser("animpossibleid", "Jane", "Doe", "Spanish", ["Mandarin"]);

    expect(result[1] === false);

    let user = result[0];

    expect(user.firstName === "John");
    expect(user.lastName === "Doe");
    expect(user.userLanguage === "English");
    expect(JSON.stringify(user.targetLanguages) === JSON.stringify(["Spanish", "French"]));
    expect(user.userId === "animpossibleid");

    expect(JSON.stringify(user.toJSON()) === JSON.stringify({ firstName: "John", lastName: "Doe", userLanguage: "English", targetLanguages: ["Spanish", "French"], userId: "animpossibleid" }));
});

test("fetching user by id returns the correct user", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    expect(user.firstName === "John");
    expect(user.lastName === "Doe");
    expect(user.userLanguage === "English");
    expect(JSON.stringify(user.targetLanguages) === JSON.stringify(["Spanish", "French"]));
    expect(user.userId === "animpossibleid");

    expect(JSON.stringify(user.toJSON()) === JSON.stringify({ firstName: "John", lastName: "Doe", userLanguage: "English", targetLanguages: ["Spanish", "French"], userId: "animpossibleid" }));
});

test("null on nonexisting id", async () => {
    let user = await UserDatabase.fetchUser("nonexistent");

    expect(user).toBe(null);
});

test("guards against unreasonable user member modifications", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    expect(() => user.firstName = "").toThrow("Name length must be between 1 and 255");
    expect(() => user.firstName = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000").toThrow("Name length must be between 1 and 255");
    expect(() => user.firstName = "").toThrow("Name length must be between 1 and 255");
    expect(() => user.lastName = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000").toThrow("Name length must be between 1 and 255");
    expect(() => user.targetLanguages = []).toThrow("Must set at least one target language");
});

test("modifications persist", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    user.firstName = "Jane";
    user.lastName = "Williams";
    user.userLanguage = "Mandarin";
    user.targetLanguages = ["Japanese"];

    user = await UserDatabase.fetchUser("animpossibleid");

    expect(user.firstName === "Jane");
    expect(user.lastName === "Williams");
    expect(user.userLanguage === "Mandarin");
    expect(JSON.stringify(user.targetLanguages) === JSON.stringify(["Japanese"]));

    expect(JSON.stringify(user.toJSON()) === JSON.stringify({ firstName: "Jane", lastName: "Williams", userLanguage: "Mandarin", targetLanguages: ["Japanese"], userId: "animpossibleid" }));

});

test("deleting user", async () => {
    let user = await UserDatabase.fetchUser("animpossibleid");

    await user.delete();

    user = await UserDatabase.fetchUser("animpossibleid");

    expect(user).toBe(null);
});