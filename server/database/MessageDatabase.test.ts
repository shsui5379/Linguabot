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

    expect(message.chatId).toBe("sample-chat-1-id");
    expect(message.content).toBe("hello world");
    expect(await message.getLanguage()).toBe("English");
    expect(await message.getUserId()).toBe("some-messagedb-test-user-id");
    expect(message.messageId).toBe("c1,m1");
    expect(message.note).toBeNull();
    expect(message.role).toBe("user");
    expect(message.starred).toBe(false);
    expect(message.timestamp >= initDate && message.timestamp <= Date.now());
});

test("Message ID collision", async () => {
    await expect(() => MessageDatabase.createMessage("c1,m1", "sample-chat-1-id", "hola world", "assistant")).rejects.toThrow("Message ID collision");
});


test("Fetching Message by message id", async () => {
    let message = await MessageDatabase.fetchMessage("c1,m1");

    expect(message.chatId).toBe("sample-chat-1-id");
    expect(message.content).toBe("hello world");
    expect(await message.getLanguage()).toBe("English");
    expect(await message.getUserId()).toBe("some-messagedb-test-user-id");
    expect(message.messageId).toBe("c1,m1");
    expect(message.note).toBeNull();
    expect(message.role).toBe("user");
    expect(message.starred).toBe(false);
    expect(message.timestamp <= Date.now());

    let json = {
        chatId: "sample-chat-1-id",
        messageId: "c1,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello world",
        role: "user",
        timestamp: message.timestamp
    };

    expect(await message.toJSON()).toMatchObject(json);
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

    expect(message.content).toBe("aloha world!");
    expect(message.note).toBe("aloha is hawaiian");
    expect(message.starred).toBe(true);

    await message.setNote("");
    await message.setStarred(false);

    message = await MessageDatabase.fetchMessage("c1,m1");

    expect(message.note).toBeNull();
    expect(message.starred).toBe(false);
});

test("fetching messages array by filtering options", async () => {
    let message = await MessageDatabase.createMessage("c2,m1", "sample-chat-2-id", "hello there", "user");
    message = await MessageDatabase.createMessage("c2,m2", "sample-chat-2-id", "hello there again", "user");
    message.setNote("a greeting");

    message = await MessageDatabase.createMessage("c3,m1", "sample-chat-3-id", "hola", "user");
    await message.setStarred(true);
    await message.setNote("1w");
    message = await MessageDatabase.createMessage("c3,m2", "sample-chat-3-id", "hola amigos", "user");
    message = await MessageDatabase.createMessage("c3,m3", "sample-chat-3-id", "hola todos", "user");
    await message.setNote("2w");

    message = await MessageDatabase.createMessage("c4,m1", "sample-chat-4-id", "hello 1", "user");
    message = await MessageDatabase.createMessage("c4,m2", "sample-chat-4-id", "hello 2", "user");
    await message.setStarred(true);
    message = await MessageDatabase.createMessage("c4,m3", "sample-chat-4-id", "hello 3", "user");
    message = await MessageDatabase.createMessage("c4,m4", "sample-chat-4-id", "hello 4", "user");
    await message.setStarred(true);

    // all messages from user
    let messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", ".*", false, false);

    expect(messages.length).toBe(10);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-1-id",
        messageId: "c1,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "aloha world!",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-2-id",
        messageId: "c2,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello there",
        role: "user",
        timestamp: messages[1].timestamp
    });
    expect(await messages[2].toJSON()).toMatchObject({
        chatId: "sample-chat-2-id",
        messageId: "c2,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: "a greeting",
        starred: false,
        content: "hello there again",
        role: "user",
        timestamp: messages[2].timestamp
    });
    expect(await messages[3].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[3].timestamp
    });
    expect(await messages[4].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m2",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hola amigos",
        role: "user",
        timestamp: messages[4].timestamp
    });
    expect(await messages[5].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m3",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "2w",
        starred: false,
        content: "hola todos",
        role: "user",
        timestamp: messages[5].timestamp
    });
    expect(await messages[6].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello 1",
        role: "user",
        timestamp: messages[6].timestamp
    });
    expect(await messages[7].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 2",
        role: "user",
        timestamp: messages[7].timestamp
    });
    expect(await messages[8].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m3",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello 3",
        role: "user",
        timestamp: messages[8].timestamp
    });
    expect(await messages[9].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m4",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 4",
        role: "user",
        timestamp: messages[9].timestamp
    });

    // from a specific chat
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", "sample-chat-3-id", ".*", false, false);

    expect(messages.length).toBe(3);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m2",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hola amigos",
        role: "user",
        timestamp: messages[1].timestamp
    });
    expect(await messages[2].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m3",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "2w",
        starred: false,
        content: "hola todos",
        role: "user",
        timestamp: messages[2].timestamp
    });

    // for a specific language
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", "English", false, false);

    expect(messages.length).toBe(7);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-1-id",
        messageId: "c1,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "aloha world!",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-2-id",
        messageId: "c2,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello there",
        role: "user",
        timestamp: messages[1].timestamp
    });
    expect(await messages[2].toJSON()).toMatchObject({
        chatId: "sample-chat-2-id",
        messageId: "c2,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: "a greeting",
        starred: false,
        content: "hello there again",
        role: "user",
        timestamp: messages[2].timestamp
    });
    expect(await messages[3].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m1",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello 1",
        role: "user",
        timestamp: messages[3].timestamp
    });
    expect(await messages[4].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 2",
        role: "user",
        timestamp: messages[4].timestamp
    });
    expect(await messages[5].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m3",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: false,
        content: "hello 3",
        role: "user",
        timestamp: messages[5].timestamp
    });
    expect(await messages[6].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m4",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 4",
        role: "user",
        timestamp: messages[6].timestamp
    });

    // only starred
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", ".*", true, false);

    expect(messages.length).toBe(3);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 2",
        role: "user",
        timestamp: messages[1].timestamp
    });
    expect(await messages[2].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m4",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 4",
        role: "user",
        timestamp: messages[2].timestamp
    });

    // only notes
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", ".*", false, true);

    expect(messages.length).toBe(3);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-2-id",
        messageId: "c2,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: "a greeting",
        starred: false,
        content: "hello there again",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[1].timestamp
    });
    expect(await messages[2].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m3",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "2w",
        starred: false,
        content: "hola todos",
        role: "user",
        timestamp: messages[2].timestamp
    });

    // starred from given chat
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", "sample-chat-4-id", ".*", true, false);

    expect(messages.length).toBe(2);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 2",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m4",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 4",
        role: "user",
        timestamp: messages[1].timestamp
    });

    // notes from given chat
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", "sample-chat-3-id", ".*", false, true);

    expect(messages.length).toBe(2);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m3",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "2w",
        starred: false,
        content: "hola todos",
        role: "user",
        timestamp: messages[1].timestamp
    });

    // stars from a language
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", "English", true, false);

    expect(messages.length).toBe(2);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m2",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 2",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-4-id",
        messageId: "c4,m4",
        language: "English",
        userId: "some-messagedb-test-user-id",
        note: null,
        starred: true,
        content: "hello 4",
        role: "user",
        timestamp: messages[1].timestamp
    });

    // notes from a language
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", "Korean", false, true);

    expect(messages.length).toBe(2);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });
    expect(await messages[1].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m3",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "2w",
        starred: false,
        content: "hola todos",
        role: "user",
        timestamp: messages[1].timestamp
    });

    // all starred and notes

    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", ".*", true, true);

    expect(messages.length).toBe(1);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });


    // all starred and notes from a chat

    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", "sample-chat-3-id", ".*", true, true);

    expect(messages.length).toBe(1);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });

    // all starred and notes from a language
    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", "Korean", true, true);

    expect(messages.length).toBe(1);

    expect(await messages[0].toJSON()).toMatchObject({
        chatId: "sample-chat-3-id",
        messageId: "c3,m1",
        language: "Korean",
        userId: "some-messagedb-test-user-id",
        note: "1w",
        starred: true,
        content: "hola",
        role: "user",
        timestamp: messages[0].timestamp
    });
});

test("fetching Message array where filters hit nothing", async () => {
    let messages = await MessageDatabase.fetchMessages("a-nonexistent-user-id", ".*", ".*", false, false);
    expect(messages.length).toBe(0);

    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", "a-nonexistent-chat-id", ".*", false, false);
    expect(messages.length).toBe(0);

    messages = await MessageDatabase.fetchMessages("some-messagedb-test-user-id", ".*", "French", false, false);
    expect(messages.length).toBe(0);
});

test("deleting message", async () => {
    let message = await MessageDatabase.fetchMessage("c1,m1");
    await message.delete();

    message = await MessageDatabase.fetchMessage("c1,m1");
    expect(message).toBeNull();
});