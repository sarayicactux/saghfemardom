var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    user_id: Sequelize.INTEGER,
    secret: Sequelize.STRING,
    name: Sequelize.STRING,
    family: Sequelize.STRING,
    aType: Sequelize.INTEGER,
    slug: Sequelize.STRING,
    email: Sequelize.STRING,
    mobile: Sequelize.STRING,
    addr: Sequelize.STRING,
    telegram: Sequelize.STRING,
    instagram: Sequelize.STRING,
    phone: Sequelize.STRING,
    pro: Sequelize.INTEGER,
    city: Sequelize.INTEGER,
    score: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    deleteable: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    last_login: Sequelize.DATE,
});
module.exports = User;