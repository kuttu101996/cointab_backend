const mysql = require("mysql2/promise");
require("dotenv").config();

const mysqlPool = mysql.createPool({
  host: process.env.DEV_SERVER,
  user: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
});

module.exports = mysqlPool;
