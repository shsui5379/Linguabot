import "dotenv/config"
import Database from "./Database"
import MessageDatabase from "./MessageDatabase"
import ChatDatabase from "./ChatDatabase"
import UserDatabase from "./UserDatabase";

beforeAll(async () => {
    await Database.initialize()
    await UserDatabase.createUser("some-messagedb-test-user-id", "John", "Doe", "English", ["Korean"]);
});

afterAll(async () => {
    await (await UserDatabase.fetchUser("some-messagedb-test-user-id")).delete();
    await Database.close()
});