var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const PagesLog = sequelize.define('PagesLog', {
    cat_id: Sequelize.INTEGER,
    cat_name: Sequelize.STRING,
    cat0_id: Sequelize.INTEGER,
    cat0_name: Sequelize.STRING,
    the_item_id: Sequelize.INTEGER,
    v_date: Sequelize.INTEGER,
    v_cnt: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
    {
        tableName:'pages_logs'
    }
    );
module.exports = PagesLog;