import Sequelize from "sequelize";

import ChatDatabase from "./ChatDatabase";
import MessageDatabase from "./MessageDatabase";

import User from "../types/User";
import { Language } from "../types/Language"

const sequelize = new Sequelize.Sequelize(process.env.POSTGRES_URL!, { logging: false });

// ---- Models ----

class UserDatabase extends Sequelize.Model { };

UserDatabase.init({
    firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    userLanguage: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: "English",
        validate: {
            is: new RegExp("English|Spanish|French|Mandarin|Japanese|Korean")
        }
    },
    targetLanguages: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        allowNull: false,
        validate: {
            min: 1,
            isValidLanguage: function (value) {
                if (!value) return value;

                let values = (Array.isArray(value)) ? value : [value];

                values.forEach(function (val) {
                    if (!(new RegExp("English|Spanish|French|Mandarin|Japanese|Korean").test(val))) {
                        throw new Error("Invalid language.");
                    }
                });
                return value;
            }

        }
    },
    userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    }
}, { sequelize });

ChatDatabase.init(sequelize);
MessageDatabase.init(sequelize);

// ---- Relationships ----

ChatDatabase.ChatDatabase.hasMany(MessageDatabase.MessageDatabase, { foreignKey: "chatId" });
MessageDatabase.MessageDatabase.belongsTo(ChatDatabase.ChatDatabase, { foreignKey: "chatId" });

UserDatabase.hasMany(ChatDatabase.ChatDatabase, { foreignKey: "userId" });
ChatDatabase.ChatDatabase.belongsTo(UserDatabase, { foreignKey: "userId" });

UserDatabase.belongsToMany(MessageDatabase.MessageDatabase, { through: ChatDatabase.ChatDatabase, foreignKey: "userId", sourceKey: "userId", otherKey: "chatId", targetKey: "chatId" });
MessageDatabase.MessageDatabase.belongsToMany(UserDatabase, { through: ChatDatabase.ChatDatabase, foreignKey: "chatId", sourceKey: "chatId", otherKey: "userId", targetKey: "userId" });

// ---- DB Functions ----

async function initialize() {
    await sequelize.authenticate().catch((error) => { console.error("Error connecting to database: ", error) });
    await sequelize.sync({ alter: true }).catch((error) => { console.error("Error syncing database model: ", error) });
}

async function close() {
    await sequelize.close();
}

// ---- User Functions ----

/**
 * Fetches a User object by its ID
 * @param userId User ID of the user to fetch
 * @returns A User object representing the requested user. null if nonexistent
 */
async function fetchUser(userId: string): Promise<User | null> {
    const instance = await UserDatabase.findOne({
        where: {
            userId: userId
        }
    }).catch((error) => console.error("Error doing database lookup of " + userId, error));

    if (!instance) {
        return null;
    }

    return new User(instance);
}

/**
 * Creates a user with the given characteristics. If the user ID already exists, it'll be fetched instead.
 * @param userId The user ID to assign
 * @param firstName The first name to assign
 * @param lastName The last name to assign
 * @param userLanguage The language that the user wants their interface to be in
 * @param targetLanguages The languages that the user wants to learn
 * @returns Array where index 0 is the user that was described by the parameters. Index 1 is whether the user is just newly created in the database.
 */
async function createUser(userId: string, firstName: string, lastName: string, userLanguage: Language, targetLanguages: Language[]): Promise<[User, boolean] | null> {
    if (userId.length === 0) throw new Error("User Id cannot have 0 length");
    if (firstName.length === 0 || firstName.length > 255) throw new Error("First name length must be between 0 and 255 characters long");
    if (lastName.length === 0 || lastName.length > 255) throw new Error("Last name length must be between 0 and 255 characters long");
    if (targetLanguages.length === 0) throw new Error("User must have at least one target language");

    try {
        const [instance, justCreated] = await UserDatabase.findOrCreate({
            where: { userId: userId },
            defaults: {
                firstName: firstName,
                lastName: lastName,
                userLanguage: userLanguage,
                targetLanguages: targetLanguages
            }
        });

        return [new User(instance), justCreated];
    } catch (error) {
        console.error("Error creating user", firstName, lastName, userId, userLanguage, targetLanguages, error)
    }

    return null;
}


export default { fetchUser, createUser, initialize, close };