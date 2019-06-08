var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Brand1 = sequelize.define('Brand1', {
        title: Sequelize.STRING,
        en_title: Sequelize.STRING,
        slug: Sequelize.STRING,
        logo: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'brands'
    }
);
module.exports = Brand1;