var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const CarImage = sequelize.define('CarImage', {
        car_id: Sequelize.INTEGER,
        img_url: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'car_images'
    }
);
module.exports = CarImage;