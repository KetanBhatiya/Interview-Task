// src/config/data-source.js
const { DataSource } = require('typeorm');
require('dotenv').config();

const myDataSource = new DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../entities/*.js'],
    migrations: [__dirname + '/../migrations/*.js'],
    subscribers: [],
});

module.exports = {myDataSource};