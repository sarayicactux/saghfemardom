var     sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const AdvImage = sequelize.define('AdvImage', {


        adv_id: Sequelize.INTEGER,
        img_url: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'adv_image'
    }
);
module.exports = AdvImage;