var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const BusinessType = sequelize.define('BusinessType', {
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'business_type'
    }
);
module.exports = BusinessType;