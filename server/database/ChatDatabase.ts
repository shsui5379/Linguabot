import Sequelize from "sequelize";

class ChatDatabase extends Sequelize.Model { };

function init(sequelize: Sequelize.Sequelize) {
    ChatDatabase.init({
        chatId: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            primaryKey: true
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
        }
    }, { sequelize });
}

export default { init, ChatDatabase }