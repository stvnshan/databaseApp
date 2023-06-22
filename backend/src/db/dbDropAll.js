const pool = require('./dbPool');

////////////////////////////////////////////////////////////////////////////////
// dbDropAll.js
// Drop all tables script.
////////////////////////////////////////////////////////////////////////////////

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
