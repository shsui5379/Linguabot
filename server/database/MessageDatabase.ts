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
        human: {
            type: Sequelize.DataTypes.BOOLEAN,
            allowNull: false
        }
    }, { sequelize });
}

export default { init, MessageDatabase }