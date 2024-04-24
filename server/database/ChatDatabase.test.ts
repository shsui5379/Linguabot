import "dotenv/config"
import Database from "./Database"
import ChatDatabase from "./ChatDatabase"
import UserDatabase from "./UserDatabase";

beforeAll(async () => {
    await Database.initialize()
    await UserDatabase.createUser("some-chatdb-test-user-id", "John", "Doe", "English", ["Korean"]);
});

afterAll(async () => {
    await (await UserDatabase.fetchUser("some-chatdb-test-user-id")).delete();
    await Database.close()
});

test("Chat creation parameter guards", async () => {
    await expect(() => ChatDatabase.createChat("", "some-user-id", "main chat", "English")).rejects.toThrow("chatId cannot have 0 length");
    await expect(() => ChatDatabase.createChat("some-chat-1-id", "", "main chat", "English")).rejects.toThrow("userId cannot have 0 length");
    await expect(() => ChatDatabase.createChat("some-chat-1-id", "some-user-id", "", "English")).rejects.toThrow("Nickname needs to be between 1-255 length");
    await expect(() => ChatDatabase.createChat("some-chat-1-id", "some-user-id", "A nickname that is toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong", "English")).rejects.toThrow("Nickname needs to be between 1-255 length");
});

test("Chat creation and verify data is set correctly", async () => {
    let initDate = Date.now();
    let result = await ChatDatabase.createChat("some-chat-1-id", "some-chatdb-test-user-id", "main chat", "English");

    expect(result.chatId === "some-chat-1-id");
    expect(result.language === "English");
    expect(result.nickname === "main chat");
    expect(result.userId === "some-chatdb-test-user-id");
    expect(result.timestamp >= initDate && result.timestamp <= Date.now());
});

test("deleting Chat", async () => {
    let chat = await ChatDatabase.fetchChat("some-chat-1-id");
    await chat.delete();

    chat = await ChatDatabase.fetchChat("some-chat-1-id");
    expect(chat).toBeNull()
});