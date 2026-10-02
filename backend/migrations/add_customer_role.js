require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/db');

async function migrate() {
  try {
    console.log('Connecting to database...');
    // Modify the role ENUM to include CUSTOMER
    console.log('Adding CUSTOMER role to users table...');
    await db.query(`ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN', 'MANAGER', 'CASHIER', 'WAITER', 'KITCHEN', 'CUSTOMER') NOT NULL`);
    console.log('Migration successful: CUSTOMER role added.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrate();
