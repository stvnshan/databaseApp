const pool = require('../backend/src/db/pool');

const dropAllTables = async () => {
  const createTableQuery = `
    DROP TABLE IF EXISTS Incident CASCADE;
    DROP TABLE IF EXISTS Victim CASCADE;
    DROP TABLE IF EXISTS City CASCADE;
    DROP TABLE IF EXISTS Agency CASCADE;
    DROP TABLE IF EXISTS ORICode CASCADE;
    DROP TABLE IF EXISTS HappensIn CASCADE;
    DROP TABLE IF EXISTS AgenciesInvolved CASCADE;
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
