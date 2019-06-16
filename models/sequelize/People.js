var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const People = sequelize.define('people', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    family: Sequelize.STRING,
    slug: Sequelize.STRING,
    email: Sequelize.STRING,
    mobile: Sequelize.STRING,
    addr: Sequelize.STRING,
    telegram: Sequelize.STRING,
    instagram: Sequelize.STRING,
    description: Sequelize.STRING,
    business_type: Sequelize.INTEGER,
    credit: Sequelize.INTEGER,
    business_gr: Sequelize.INTEGER,
    phone: Sequelize.STRING,
    pro: Sequelize.INTEGER,
    city: Sequelize.INTEGER,
    score: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    rcode: Sequelize.INTEGER,
    deleteable: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    last_login: Sequelize.DATE,

},
    {
        tableName:'people'
    });
module.exports = People;