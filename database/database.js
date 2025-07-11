require('dotenv').config(); //carreguei as variáveis do .env
const Sequelize = require('sequelize');
const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
})

module.exports = connection