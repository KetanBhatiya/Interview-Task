const { DataSource } = require("typeorm");
require('dotenv').config();

console.log("DB_TYPE:", process.env.DB_TYPE)
const myDataSource = new DataSource({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Set to false when using migrations
  logging: false,
  entities: [__dirname + '/../entities/*.js'],
  migrations: [__dirname + '/../migrations/*.js'], // Ensure this path is correct
  subscribers: [],
});


// const AppDataSource = new DataSource(myDataSource);

module.exports = { myDataSource };