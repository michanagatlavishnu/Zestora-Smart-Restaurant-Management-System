const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zestora_db',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000
};

// Configure MySQL SSL appropriately for Aiven production connections
// Keeps local development working when DB_SSL is not required
if (process.env.DB_SSL === 'true' || (process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud.com'))) {
  dbConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
  };
  
  if (process.env.DB_SSL_CA) {
    dbConfig.ssl.ca = process.env.DB_SSL_CA;
  }
}

const pool = mysql.createPool(dbConfig);

module.exports = pool;
