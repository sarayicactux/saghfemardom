var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const BusinessGr = sequelize.define('BusinessGr', {
        business_type_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        slug: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'business_gr'
    }
);
module.exports = BusinessGr;