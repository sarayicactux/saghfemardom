var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const NewsGr = sequelize.define('NewsGr', {


        title: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'news_gr'
    }
);
module.exports = NewsGr;