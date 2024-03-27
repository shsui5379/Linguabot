import "dotenv/config";
import UserDatabase from "./UserDatabase";

beforeAll(async () => await UserDatabase.initialize());

afterAll(async () => await UserDatabase.close());

test("guards against unreasonable user data parameters during creation", async () => {
    await expect(() => UserDatabase.createUser("", "John", "Doe", "English", ["Spanish"])).rejects.toThrow("User Id cannot have 0 length");
});