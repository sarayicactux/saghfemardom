var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const RegisterRq = sequelize.define('RegisterRq', {


            token: Sequelize.STRING,
            ip: Sequelize.STRING,
            mobile: Sequelize.STRING,
            count: Sequelize.INTEGER,
            rq_time: Sequelize.INTEGER,
            code: Sequelize.INTEGER,
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
    },
    {
        tableName:'register_rq'
    }
);
module.exports = RegisterRq;