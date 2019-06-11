var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Faq = sequelize.define('Faq', {

        title: Sequelize.STRING,
        description: Sequelize.STRING,
        active : Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'faq'
    }
);
module.exports = Faq;