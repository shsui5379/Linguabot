import Sequelize from "sequelize";
import { Language } from "../types/Language";
import Chat from "../types/Chat";
import MessageDatabase from "./MessageDatabase";

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
        },
        timestamp: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            defaultValue: () => Date.now()
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
async function createChat(chatId: string, userId: string, nickname: string, language: Language): Promise<Chat> {
    if (chatId.length === 0) throw new Error("chatId cannot have 0 length");
    if (userId.length === 0) throw new Error("userId cannot have 0 length");
    if (nickname.length === 0 || nickname.length > 255) throw new Error("Nickname needs to be between 1-255 length");

    // index 0: instance
    // index 1: justCreated
    let result;

    try {
        result = await ChatDatabase.findOrCreate({
            where: { chatId: chatId },
            defaults: {
                userId: userId,
                language: language,
                nickname: nickname,
                timestamp: Date.now()
            }
        });
    } catch (error) {
        console.error("Error creating chat ", chatId, userId, language, error);
    }

    if (result[1]) {
        return new Chat(result[0]);
    } else {
        throw new Error("Chat already exists in database");
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
        },
        order: [
            ["timestamp", "ASC"]
        ]
    }).catch((error) => console.error("Error looking up chats for ", userId, error));

    if (results) {
        for (let result of results) {
            output.push(new Chat(result));
        }
    }

    return output;
}

/**
 * Deletes chats that haven't been messaged in for over 30 days
 */
async function deleteOldChats() {
    const results = await ChatDatabase.findAll({
        where: {
            timestamp: { [Sequelize.Op.lt]: Date.now() - 30 * 24 * 60 * 60 * 1000 }
        }
    });

    let chats = results.map((record) => { return new Chat(record) });

    for (let chat of chats) {
        let messages = await MessageDatabase.fetchMessages(chat.userId, chat.chatId, ".*", false, false);

        if (messages[messages.length - 1].timestamp < Date.now() - 30 * 24 * 60 * 60 * 1000) {
            await chat.delete()
        }
    }
}

export default { init, ChatDatabase, createChat, fetchChat, fetchChats, deleteOldChats }