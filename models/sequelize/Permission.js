var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Permission = sequelize.define('Permission', {

        role_id: Sequelize.INTEGER,
        module_id: Sequelize.INTEGER,
        access: Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'permissions'
    }
);
module.exports = Permission;