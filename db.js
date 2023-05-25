const { Pool } = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: '@Swz030104',
    port: 5432,
});

pool.query("SELECT * FROM student WHERE name = 'alice'", (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      // Handle the error appropriately
    } else {
      const aliceUser = result.rows[0];
      console.log(aliceUser);
      // Use the retrieved user data as needed
    }
});

module.exports = pool;