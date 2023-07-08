const { Pool } = require('pg');
require('dotenv').config();

////////////////////////////////////////////////////////////////////////////////
// pool.js
// PostgreSQL database pool connection instance, initialized with credentials stored in .env.
////////////////////////////////////////////////////////////////////////////////

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = pool;
