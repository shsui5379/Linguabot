import Sequelize from "sequelize";

import UserDatabase from "./UserDatabase";
import ChatDatabase from "./ChatDatabase";
import MessageDatabase from "./MessageDatabase";

const sequelize = new Sequelize.Sequelize(process.env.POSTGRES_URL!, { logging: false });

ChatDatabase.init(sequelize);
MessageDatabase.init(sequelize);
UserDatabase.init(sequelize);

UserDatabase.UserDatabase.hasMany(ChatDatabase.ChatDatabase, { foreignKey: "userId", onDelete: "CASCADE", hooks: true });
ChatDatabase.ChatDatabase.belongsTo(UserDatabase.UserDatabase, { foreignKey: "userId" });

ChatDatabase.ChatDatabase.hasMany(MessageDatabase.MessageDatabase, { foreignKey: "chatId", onDelete: "CASCADE", hooks: true });
MessageDatabase.MessageDatabase.belongsTo(ChatDatabase.ChatDatabase, { foreignKey: "chatId" });

async function initialize() {
    await sequelize.authenticate().catch((error) => { console.error("Error connecting to database: ", error) });
    // await sequelize.sync({ alter: true }).catch((error) => { console.error("Error syncing database model: ", error) });

    await ChatDatabase.deleteOldChats();
}

async function close() {
    await sequelize.close();
}

export default { initialize, close };