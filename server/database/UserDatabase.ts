import Sequelize from "sequelize";

import User from "../types/User";
import { Language } from "../types/Language"

const sequelize = new Sequelize.Sequelize(process.env.POSTGRES_URL!);

try {
    sequelize.authenticate();
} catch (error) {
    console.error("Error connecting to database: ", error);
}

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
        defaultValue: "English"
    },
    targetLanguages: {
        type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),
        allowNull: false
    },
    userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    }
}, { sequelize });

sequelize.sync({ alter: true }).catch((error) => { console.error("Error syncing database model: ", error) });

// post-MVP stretch goal: UserDatabase.hasMany(NotesDatabase);
// post-MVP stretch goal: UserDatabase.hasMany(ConversationHistoryDatabase);
//                        foreignKey: "userId"


/**
 * Fetches a User object by its ID
 * @param userId User ID of the user to fetch
 * @returns A User object representing the requested user. null if nonexistent
 */
function fetchUser(userId: string): User | null {

}

/**
 * Creates a user with the given characteristics. If the user ID already exists, it'll be fetched instead.
 * @param userId The user ID to assign
 * @param firstName The first name to assign
 * @param lastName The last name to assign
 * @param sourceLanguage The language that the user wants their interface to be in
 * @param targetLanguages The languages that the user wants to learn
 * @returns Array where index 0 is the user that was described by the parameters. Index 1 is whether the user was already preexisting in the database.
 */
function createUser(userId: string, firstName: string, lastName: string, sourceLanguage: Language, targetLanguages: Language[]): [User, boolean] {

}


export default { fetchUser, createUser };