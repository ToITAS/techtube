require("dotenv").config();
/*
module.exports = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "techtube",
};
*/

module.exports = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
