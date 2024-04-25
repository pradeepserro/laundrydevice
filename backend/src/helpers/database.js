const mysql = require('mysql2');
// require createPool from mysql2
const { createPool } = require('mysql2/promise');

const currentConfig = require('../config');

// Create a MySQL connection pool
const db = createPool({
  host: 'localhost', // Your MySQL host
  user: 'pradeep', // Your MySQL username
  password: 'Abcd@1234', // Your MySQL password
  database: 'spincycle', // Your MySQL schema/database name (laundry in your case)
  namedPlaceholders: true,
});

module.exports = db;
