var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Car = sequelize.define('Car', {
        brand1_id: Sequelize.INTEGER,
        brand2_id: Sequelize.INTEGER,
        show_price: Sequelize.INTEGER,
        price: Sequelize.INTEGER,
        model: Sequelize.STRING,
        slug: Sequelize.STRING,
        video: Sequelize.STRING,
        tech_spec: Sequelize.STRING,
        description: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'cars'
    }
);
module.exports = Car;