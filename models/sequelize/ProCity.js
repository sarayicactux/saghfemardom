var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const ProCity = sequelize.define('ProCity', {

        pro_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'pro_cities'
    }
);
module.exports = ProCity;