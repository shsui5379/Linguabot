import "dotenv/config"
import Database from "./Database"
import ChatDatabase from "./ChatDatabase"
import UserDatabase from "./UserDatabase";
import MessageDatabase from "./MessageDatabase";

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
    let result = await ChatDatabase.createChat("some-chat-1-id", "some-chatdb-test-user-id", "main chat", "Spanish");

    expect(result.chatId === "some-chat-1-id");
    expect(result.language === "Spanish");
    expect(result.nickname === "main chat");
    expect(result.userId === "some-chatdb-test-user-id");
    expect(result.timestamp >= initDate && result.timestamp <= Date.now());
});

test("Chat ID collision", async () => {
    await ChatDatabase.createChat("some-chat-2-id", "some-chatdb-test-user-id", "a second chat", "English");

    await expect(() => ChatDatabase.createChat("some-chat-2-id", "some-chatdb-test-user-id", "here we go again", "Mandarin")).rejects.toThrow("Chat already exists in database");
});


test("fetching Chat by ID", async () => {
    let chat = await ChatDatabase.fetchChat("some-chat-2-id");

    expect(chat.chatId === "some-chat-2-id");
    expect(chat.language === "English");
    expect(chat.nickname === "a second chat");
    expect(chat.userId === "some-chatdb-test-user-id");
    expect(chat.timestamp <= Date.now());
});

test("fetching Chat invalid ID", async () => {
    let chat = await ChatDatabase.fetchChat("aninvalidchatid");

    expect(chat).toBeNull();
});

test("Chat property setter guards", async () => {
    let chat = await ChatDatabase.fetchChat("some-chat-1-id");

    await expect(() => chat.setNickname("")).rejects.toThrow("Nickname needs to be between 1-255 characters long");
    await expect(() => chat.setNickname("A nickname that is toooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong")).rejects.toThrow("Nickname needs to be between 1-255 characters long");
});

test("Chat property setter data persists", async () => {
    let chat = await ChatDatabase.fetchChat("some-chat-1-id");
    await chat.setNickname("a changed nickname");

    chat = await ChatDatabase.fetchChat("some-chat-1-id");
    expect(chat.nickname === "a changed nickname");
});

test("fetching Chats array by user ID", async () => {
    await ChatDatabase.createChat("some-chat-3-id", "some-chatdb-test-user-id", "a third chat", "Spanish");

    let chats = await ChatDatabase.fetchChats("some-chatdb-test-user-id");

    expect(chats.length === 3);

    expect(chats[0].chatId === "some-chat-1-id");
    expect(chats[0].language === "Spanish");
    expect(chats[0].nickname === "a changed nickname");
    expect(chats[0].userId === "some-chatdb-test-user-id");
    expect(chats[0].timestamp <= Date.now());

    expect(chats[1].chatId === "some-chat-2-id");
    expect(chats[1].language === "English");
    expect(chats[1].nickname === "a second chat");
    expect(chats[1].userId === "some-chatdb-test-user-id");
    expect(chats[1].timestamp <= Date.now());

    expect(chats[2].chatId === "some-chat-3-id");
    expect(chats[2].language === "Spanish");
    expect(chats[2].nickname === "a third chat");
    expect(chats[2].userId === "some-chatdb-test-user-id");
    expect(chats[2].timestamp <= Date.now());
});

test("fetching Chats array with invalid ID", async () => {
    let chats = await ChatDatabase.fetchChats("aninvaliduserid");
    expect(chats.length === 0);
});

test("fetching Chats array by langauge for a user", async () => {
    await ChatDatabase.createChat("some-chat-4-id", "some-chatdb-test-user-id", "a fourth chat", "Spanish");

    let chats = await ChatDatabase.fetchChats("some-chatdb-test-user-id", "Spanish");

    expect(chats.length === 3);

    expect(chats[0].chatId === "some-chat-1-id");
    expect(chats[0].language === "Spanish");
    expect(chats[0].nickname === "a changed nickname");
    expect(chats[0].userId === "some-chatdb-test-user-id");
    expect(chats[0].timestamp <= Date.now());

    expect(chats[1].chatId === "some-chat-3-id");
    expect(chats[1].language === "Spanish");
    expect(chats[1].nickname === "a third chat");
    expect(chats[1].userId === "some-chatdb-test-user-id");
    expect(chats[1].timestamp <= Date.now());

    expect(chats[2].chatId === "some-chat-4-id");
    expect(chats[2].language === "Spanish");
    expect(chats[2].nickname === "a fourth chat");
    expect(chats[2].userId === "some-chatdb-test-user-id");
    expect(chats[2].timestamp <= Date.now());
});

test("fetching Chats array with invalid ID with language", async () => {
    let chats = await ChatDatabase.fetchChats("aninvaliduserid", "French");
    expect(chats.length === 0);
});

test("fetching Chats array with with language with nothing", async () => {
    let chats = await ChatDatabase.fetchChats("some-chatdb-test-user-id", "French");
    expect(chats.length === 0);
});

test("deleting Chat", async () => {
    await MessageDatabase.createMessage("testmessage1", "some-chat-1-id", "meow", "user");

    let message = await MessageDatabase.fetchMessage("testmessage1");
    expect(message).not.toBeNull();

    let chat = await ChatDatabase.fetchChat("some-chat-1-id");
    await chat.delete();

    chat = await ChatDatabase.fetchChat("some-chat-1-id");
    expect(chat).toBeNull()

    message = await MessageDatabase.fetchMessage("testmessage1");
    expect(message).toBeNull();
});