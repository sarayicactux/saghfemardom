var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const CarAdv = sequelize.define('CarAdv', {

        user_id: Sequelize.INTEGER,
        admin_id: Sequelize.INTEGER,
        pro_id: Sequelize.INTEGER,
		pro_name: Sequelize.STRING,
		city_id: Sequelize.INTEGER,
		city_name: Sequelize.STRING,
        selling_type: Sequelize.INTEGER,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        brand: Sequelize.INTEGER,
        model: Sequelize.INTEGER,
        video_url: Sequelize.STRING,
        price: Sequelize.INTEGER,
        loan_amount: Sequelize.INTEGER,
        pre_payment: Sequelize.STRING,
        payment_pr: Sequelize.STRING,
        payment_count: Sequelize.INTEGER,
        payment_amount: Sequelize.INTEGER,
        dis_status : Sequelize.INTEGER,
        delivery_time: Sequelize.STRING,
        terms: Sequelize.STRING,
        status: Sequelize.INTEGER,
        checked: Sequelize.INTEGER,
        visitcnt: Sequelize.INTEGER,
        reason: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        actived_at: Sequelize.DATE,
    },
    {
        tableName:'car_advs'
    }
);
module.exports = CarAdv;