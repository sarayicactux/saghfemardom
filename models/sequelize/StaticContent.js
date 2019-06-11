var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const StaticContent = sequelize.define('StaticContent', {
        
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'static_content'
    }
);
module.exports = StaticContent;