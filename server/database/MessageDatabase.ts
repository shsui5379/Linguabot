import Sequelize from "sequelize";

import Message from "../types/Message";
import { Language } from "../types/Language";

class MessageDatabase extends Sequelize.Model { };

function init(sequelize: Sequelize.Sequelize) {
    MessageDatabase.init({
        messageId: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        chatId: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: Sequelize.DataTypes.STRING
        },
        starred: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        role: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            validate: {
                is: new RegExp("system|assistant|user")
            }
        },
        timestamp: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: () => Date.now()
        }
    }, { sequelize });
}

/**
 * Fetches an array of Messages based on given filtering criteria.
 * @param userId ID of the User to fetch Messages for
 * @param chatId ID of the Chat the the Message originated from.
 * @param language Language of the Messages to fetch. Omit to select all.
 * @param mustHaveStar Whether the Messages fetched shall be starred messages. Omit to select all.
 * @param mustHaveNote Whether the Messages fetched shall have a Note. Omit to select all.
 * @returns Array of Messages matching the filtering criteria.
 */
async function fetchMessages(userId: string, chatId: string = ".*", language: Language | ".*" = ".*", mustHaveStar: boolean | ".*" = ".*", mustHaveNote: boolean | ".*" = ".*"): Promise<Message[]> {

}

/**
 * Fetches a Message object by its ID
 * @param messageId Message ID of Message to fetch
 * @returns A Message object representing the requested message. null if not found.
 */
async function fetchMessage(messageId: string): Promise<Message | null> {
    const instance = await MessageDatabase.findOne({
        where: {
            messageId: messageId
        }
    }).catch((error) => console.error("Error doing database lookup of message ", messageId, error));

    if (!instance) {
        return null;
    }

    return new Message(instance);
}

/**
 * Creates a new Message from given parameters.
 * @param messageId ID to assign to message
 * @param chatId ID of the Chat this Message belongs to
 * @param content The content of this Message
 * @param role The author of the message: system, assistant, user
 * @returns The newly created Message, as long as a messageId collision didn't occur.
 */
async function createMessage(messageId: string, chatId: string, content: string, role: "system" | "assistant" | "user"): Promise<Message> {
    if (messageId.length === 0) throw new Error("Message ID cannot be empty");
    if (chatId.length === 0) throw new Error("Chat ID cannot be empty");
    if (content.length === 0) throw new Error("Content cannot be empty");

    try {
        const [instance, justCreated] = await MessageDatabase.findOrCreate({
            where: { messageId: messageId },
            defaults: {
                chatId: chatId,
                content: content,
                note: null,
                starred: false,
                role: role,
                timestamp: Date.now()
            }
        });

        if (!justCreated) throw new Error("Message ID collision");

        return new Message(instance);
    } catch (error) {
        console.error("Error creating message ", messageId, chatId, content, role);
    }
}

export default { init, MessageDatabase, fetchMessage, createMessage, fetchMessages }