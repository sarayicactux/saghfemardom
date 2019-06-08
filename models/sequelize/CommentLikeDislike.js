var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const CommentLikeDislike = sequelize.define('CommentLikeDislike', {
        user_id: Sequelize.INTEGER,
        comment_id: Sequelize.INTEGER,
        ip: Sequelize.STRING,
        vote: Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'comment_like_dislike'
    }
);
module.exports = CommentLikeDislike;