const pool = require('./pool');
const testDatabase = require('./testDatabase');

const runTests = async () => {
  await testDatabase();
  pool.end();
}

runTests();
