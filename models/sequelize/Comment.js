var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Comment = sequelize.define('Comment', {
        people_id: Sequelize.INTEGER,
        adv_id: Sequelize.INTEGER,
        parent_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        text: Sequelize.STRING,
        stars: Sequelize.INTEGER,
        active: Sequelize.INTEGER,
        archive: Sequelize.INTEGER,
        like: Sequelize.INTEGER,
        unlike: Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'comments'
    }
);
module.exports = Comment;