const { Pool } = require('pg');

const pool = new Pool({
  user: 'sample',
  host: 'localhost',
  database: 'cs348sample',
  password: 'cs348',
  port: 5432,
});

module.exports = pool;
