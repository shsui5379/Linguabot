import "dotenv/config"
import Database from "./Database"
import MessageDatabase from "./MessageDatabase"
import ChatDatabase from "./ChatDatabase"
import UserDatabase from "./UserDatabase";

beforeAll(async () => {
    await Database.initialize()
    await UserDatabase.createUser("some-messagedb-test-user-id", "John", "Doe", "English", ["Korean"]);

    await ChatDatabase.createChat("sample-chat-1-id", "some-messagedb-test-user-id", "dummy chat 1 eng", "English");
    await ChatDatabase.createChat("sample-chat-2-id", "some-messagedb-test-user-id", "dummy chat 2 eng", "English");
    await ChatDatabase.createChat("sample-chat-3-id", "some-messagedb-test-user-id", "dummy chat 3 kor", "Korean");
    await ChatDatabase.createChat("sample-chat-4-id", "some-messagedb-test-user-id", "dummy chat 4 eng", "English");
});

afterAll(async () => {
    await (await UserDatabase.fetchUser("some-messagedb-test-user-id")).delete();
    await Database.close()
});

test("Message creation parameter validation", async () => {
    await expect(() => MessageDatabase.createMessage("", "sample-chat-1-id", "hello world", "assistant")).rejects.toThrow("Message ID cannot be empty");
    await expect(() => MessageDatabase.createMessage("c1,m1", "", "hello world", "assistant")).rejects.toThrow("Chat ID cannot be empty");
    await expect(() => MessageDatabase.createMessage("c1,m1", "sample-chat-1-id", "", "assistant")).rejects.toThrow("Content length needs to be 1-1024 characters long");
    await expect(() => MessageDatabase.createMessage("c1,m1", "sample-chat-1-id", "a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", "assistant")).rejects.toThrow("Content length needs to be 1-1024 characters long");
});

test("Message creation and verification of properties", async () => {
    let initDate = Date.now();
    let message = await MessageDatabase.createMessage("c1,m1", "sample-chat-1-id", "hello world", "user");

    expect(message.chatId === "sample-chat-1-id");
    expect(message.content === "hello world");
    expect(await message.getLanguage() === "English");
    expect(await message.getUserId() === "some-messagedb-test-user-id");
    expect(message.messageId === "c1,m1");
    expect(message.note).toBeNull();
    expect(message.role === "user");
    expect(message.starred === false);
    expect(message.timestamp >= initDate && message.timestamp <= Date.now());
});

test("Message ID collision", async () => {
    await expect(() => MessageDatabase.createMessage("c1,m1", "sample-chat-1-id", "hola world", "assistant")).rejects.toThrow("Message ID collision");
});


test("Fetching Message by message id", async () => {
    let message = await MessageDatabase.fetchMessage("c1,m1");

    expect(message.chatId === "sample-chat-1-id");
    expect(message.content === "hello world");
    expect(await message.getLanguage() === "English");
    expect(await message.getUserId() === "some-messagedb-test-user-id");
    expect(message.messageId === "c1,m1");
    expect(message.note).toBeNull();
    expect(message.role === "user");
    expect(message.starred === false);
    expect(message.timestamp <= Date.now());

    let json = {
        chatId: "sample-chat-1-id",
        messageId: "c1,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello world",
        timestamp: message.timestamp
    };

    expect(JSON.stringify(await message.toJSON()) === JSON.stringify(json));
});

test("Fetching Message by invalid message id", async () => {
    let message = await MessageDatabase.fetchMessage("messagethatdoesn'texist");

    expect(message).toBeNull();
});

test("Message property setter validations", async () => {
    let message = await MessageDatabase.fetchMessage("c1,m1");

    await expect(() => message.setContent("")).rejects.toThrow("Message content length needs to be 1-1024 characters long");
    await expect(() => message.setContent("a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! a message that is just waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaay toooooooooooooooooooooooooooooooooooooooo loooooooooooooooooooooooooooooooooooooooooooooooooooooooong!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")).rejects.toThrow("Message content length needs to be 1-1024 characters long");
});

test("Message property setters and data persistence", async () => {
    let message = await MessageDatabase.fetchMessage("c1,m1");

    await message.setContent("aloha world!");
    await message.setNote("aloha is hawaiian")
    await message.setStarred(true);

    message = await MessageDatabase.fetchMessage("c1,m1");

    expect(message.content === "aloha world!");
    expect(message.note === "aloha is hawaiian");
    expect(message.starred === true);

    await message.setNote("");
    await message.setStarred(false);

    message = await MessageDatabase.fetchMessage("c1,m1");

    expect(message.note).toBeNull();
    expect(message.starred === false);
});

test("fetching messages array by filtering options", async () => {

});

test("deleting message", async () => {
    let message = await MessageDatabase.fetchMessage("c1,m1");
    await message.delete();

    message = await MessageDatabase.fetchMessage("c1,m1");
    expect(message).toBeNull();
});