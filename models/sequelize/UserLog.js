var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const UserLog = sequelize.define('UserLog', {
        user_id: Sequelize.INTEGER,
        action: Sequelize.STRING,
        str: Sequelize.STRING,
        table_name: Sequelize.STRING,
        row_id: Sequelize.INTEGER,
        ip: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'userlogs'
    });
module.exports = UserLog;