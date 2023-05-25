const { Pool } = require('pg');

const pool = new Pool({
  user: 'newuser',
  host: 'localhost',
  database: 'test',
  password: 'password',
  port: 5432, // default PostgreSQL port
});

pool.query("SELECT * FROM users WHERE name = 'John'", (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      // Handle the error appropriately
    } else {
      const johnUser = result.rows[0];
      console.log(johnUser);
      // Use the retrieved user data as needed
    }
  });

module.exports = pool;