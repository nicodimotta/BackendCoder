require('dotenv').config();

module.exports = {
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  sessionSecret: process.env.SESSION_SECRET
};
