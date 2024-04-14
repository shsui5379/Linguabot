import Sequelize from "sequelize";

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
            defaultValue: Date.now()
        }
    }, { sequelize });
}

export default { init, MessageDatabase }