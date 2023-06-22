const pool = require('./dbPool');
const {
  selectAllVictimIDs,
  selectAllAgencyIDs,
  selectVictimByID,
  selectAgencyByID,
  selectIncidentByID,
  selectAllIncidentIDs
} = require('./dbQuery');

const main = async () => {
  try {
  data = await selectAllVictimIDs();
  console.log(data);
  data = await selectAllAgencyIDs();
  console.log(data);
  data = await selectVictimByID(1);
  console.log(data);
  data = await selectAgencyByID(70);
  console.log(data);
  data = await selectAgencyByID(1055);
  console.log(data);
  data = await selectAgencyByID(3187);
  console.log(data);
  data = await selectAllIncidentIDs();
  console.log(data);
  data = await selectIncidentByID(3);
  console.log(data);
  data = await selectIncidentByID(4);
  console.log(data);
  data = await selectIncidentByID(5);
  console.log(data);
  data = await selectIncidentByID(8);
  console.log(data);

  } catch (error) {
  console.error('Error selecting data', error);
  } finally {
  pool.end();
  }
};

main();
