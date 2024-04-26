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