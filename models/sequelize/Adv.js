var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Adv = sequelize.define('Adv', {

        user_id: Sequelize.INTEGER,
        admin_id: Sequelize.INTEGER,
		pro_id: Sequelize.INTEGER,
		pro_name: Sequelize.STRING,
		city_id: Sequelize.INTEGER,
		city_name: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        business_type: Sequelize.INTEGER,
        business_gr: Sequelize.INTEGER,
        video_url: Sequelize.STRING,
        status: Sequelize.INTEGER,
        checked: Sequelize.INTEGER,
        visitcnt: Sequelize.INTEGER,
        reason: Sequelize.STRING,
        dis_status : Sequelize.INTEGER,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
        actived_at: Sequelize.DATE,
    },
    {
        tableName:'advs'
    }
);
module.exports = Adv;