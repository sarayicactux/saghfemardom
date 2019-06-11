var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Modules = sequelize.define('Modules', {

        title: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'modules'
    }
);
module.exports = Modules;