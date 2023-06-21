const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


const dropAllTables = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS Incident CASCADE;
    DROP TABLE IF EXISTS Victim CASCADE;
    DROP TABLE IF EXISTS City CASCADE;
    DROP TABLE IF EXISTS Agency CASCADE;
    DROP TABLE IF EXISTS ORICodes CASCADE;
    DROP TABLE IF EXISTS AgenciesInvolved CASCADE;
    DROP TABLE IF EXISTS HasORICodes CASCADE;
    DROP TABLE IF EXISTS HappensIn CASCADE;
    DROP TABLE IF EXISTS HasVictim CASCADE;
    `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log('Tables dropped successfully.');
  } catch (error) {
    console.error('Error dropping tables: ', error);
  } finally {
    pool.end();
  }
};

dropAllTables();
