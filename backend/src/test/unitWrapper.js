const pool = require('../db/pool');
const testDatabase = require('./unit');

const runTests = async () => {
  await testDatabase();
  pool.end();
}

runTests();
