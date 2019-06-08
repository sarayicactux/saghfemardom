var     sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const CarAdvImage = sequelize.define('CarAdvImage', {


        adv_id: Sequelize.INTEGER,
        img_url: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'car_adv_image'
    }
);
module.exports = CarAdvImage;