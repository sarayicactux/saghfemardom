var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Payment = sequelize.define('Payment', {
        people_id: Sequelize.INTEGER,
        tracenumber: Sequelize.STRING,
        rrn: Sequelize.STRING,
        datePaid: Sequelize.STRING,
        digitalreceipt: Sequelize.STRING,
        issuerbank: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
    },
    {
        tableName:'payments'
    }
);
module.exports = Payment;