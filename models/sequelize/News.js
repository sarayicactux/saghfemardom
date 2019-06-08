var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const News = sequelize.define('News', {

        active: Sequelize.INTEGER,
        gr_id: Sequelize.INTEGER,
        title: Sequelize.STRING,
        slug: Sequelize.STRING,
        text: Sequelize.STRING,
        summary: Sequelize.STRING,
        source: Sequelize.STRING,
        source_link: Sequelize.STRING,
        thumb: Sequelize.STRING,
        visitcnt: Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'news'
    }
);
module.exports = News;