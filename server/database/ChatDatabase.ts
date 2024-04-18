import Sequelize from "sequelize";
import { Language } from "../types/Language";
import Chat from "../types/Chat";

class ChatDatabase extends Sequelize.Model { };

function init(sequelize: Sequelize.Sequelize) {
    ChatDatabase.init({
        chatId: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        userId: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        language: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            validate: {
                is: new RegExp("English|Spanish|French|Mandarin|Japanese|Korean")
            }
        },
        nickname: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    }, { sequelize });
}

/**
 * Creates a new Chat with given parameters.
 * If Chat ID already exists, an error will be thrown.
 * @param chatId The chat ID to assign
 * @param userId The user ID the Chat belongs to
 * @param language The Language the Chat is in
 * @returns The Chat object that was created, or a thrown Error if chatId already exists
 */
async function createChat(chatId: string, userId: string, language: Language): Promise<Chat> {
    if (chatId.length === 0) throw new Error("chatId cannot have 0 length");
    if (userId.length === 0) throw new Error("userId cannot have 0 length");

    try {
        const [instance, justCreated] = await ChatDatabase.findOrCreate({
            where: { chatId: chatId },
            defaults: {
                userId: userId,
                language: language
            }
        });

        if (justCreated) {
            return new Chat(instance);
        } else {
            throw new Error("Chat already exists in database");
        }
    } catch (error) {
        console.error("Error creating chat ", chatId, userId, language, error);
    }
}

/**
 * Fetches a Chat by ID
 * @param chatId ID of Chat to fetch
 * @returns Chat instance, or null if not found
 */
async function fetchChat(chatId: string): Promise<Chat | null> {
    const instance = await ChatDatabase.findOne({
        where: {
            chatId: chatId
        }
    }).catch((error) => console.error("Error doing database lookup of ", chatId, error));

    if (!instance) {
        return null;
    }

    return new Chat(instance);
}

/**
 * Fetches an array of Chats by user ID, and optionally a Language
 * @param userId User ID of Chats to fetch
 * @param language Language of Chats to fetch. All if not specified
 * @returns Array of Chats matching specified parameters
 */
async function fetchChats(userId: string, language: Language | ".*" = ".*"): Promise<Chat[]> {
    let output = [];

    const results = await ChatDatabase.findAll({
        where: {
            userId: userId,
            language: { [Sequelize.Op.regexp]: language }
        }
    }).catch((error) => console.error("Error looking up chats for ", userId, error));

    if (results) {
        for (let result of results) {
            output.push(new Chat(result));
        }
    }

    return output;
}

export default { init, ChatDatabase, createChat, fetchChat, fetchChats }