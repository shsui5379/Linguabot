import User from "./User";

// logged in, not registered
User.fetchUser().catch((e) => {
    console.assert(e.message === "User doesn't exist");
})

// logged in, create user
let user;

User.createUser("", "Doe", "English", ["Spanish"]).catch((e) => {
    console.assert(e.message === "First name length must be between 1 and 255");
});

User.createUser("John", "", "English", ["Spanish"]).catch((e) => {
    console.assert(e.message === "Last name length must be between 1 and 255");
})

User.createUser("John", "Doe", "English", []).catch((e) => {
    console.assert(e.message === "There must be at least 1 target language");
})

user = await User.createUser("John", "Doe", "English", ["Spanish"]);

console.assert(user.firstName === "John");
console.assert(user.lastName === "Doe");
console.assert(user.userId.length !== 0);
console.assert(user.userLanguage === "English");
console.assert(JSON.stringify(user.targetLanguages) === JSON.stringify(["Spanish"]));

// double create

user = await User.createUser("Jane", "Doe", "Mandarin", ["Japanese", "Korean"]);

console.assert(user.firstName === "John");
console.assert(user.lastName === "Doe");
console.assert(user.userId.length !== 0);
console.assert(user.userLanguage === "English");
console.assert(JSON.stringify(user.targetLanguages) === JSON.stringify(["Spanish"]));

// fetch user

user = await User.fetchUser();

console.assert(user.firstName === "John");
console.assert(user.lastName === "Doe");
console.assert(user.userId.length !== 0);
console.assert(user.userLanguage === "English");
console.assert(JSON.stringify(user.targetLanguages) === JSON.stringify(["Spanish"]));

// modify user

user.setFirstName("").catch((e) => {
    console.assert(e.message === "Name must be between 1-255 length");
})

user.setLastName("").catch((e) => {
    console.assert(e.message === "Name must be between 1-255 length");
})

user.setTargetLanguages([]).catch((e) => {
    console.assert(e.message === "Must have at least 1 target language");
})

await user.setFirstName("Jane");
await user.setLastName("Williams");
await user.setUserLanguage("Mandarin");
await user.setTargetLanguages(["Korean", "Japanese"]);

user = await User.fetchUser();

console.assert(user.firstName === "Jane");
console.assert(user.lastName === "Williams");
console.assert(user.userId.length !== 0);
console.assert(user.userLanguage === "Mandarin");
console.assert(JSON.stringify(user.targetLanguages) === JSON.stringify(["Korean", "Japanese"]));

// deleting user

await user.delete();

User.fetchUser().catch((e) => {
    console.assert(e.message === "User doesn't exist");
})