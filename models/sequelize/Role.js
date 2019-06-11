var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Role = sequelize.define('Role', {

        title: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'roles'
    }
);
module.exports = Role;