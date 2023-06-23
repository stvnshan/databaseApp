const pool = require('./dbPool');
const {
  selectAllVictimIDs,
  selectAllAgencyIDs,
  selectVictimByID,
  selectAgencyByID,
  selectIncidentByID,
  selectAllIncidentIDs,
  selectAgencyByName
} = require('./dbQuery');

const main = async () => {
  try {
  console.log();
  console.log("Select all Victim IDs:");
  data = await selectAllVictimIDs();
  console.log(data);

  console.log();
  console.log("Select information about Victim with ID 1:");
  data = await selectVictimByID(1);
  console.log(data);

  console.log();
  console.log("Select all Agency IDs:");
  data = await selectAllAgencyIDs();
  console.log(data);

  console.log();
  console.log("Select information about Agencies with IDs 70, 1055, and 3187:");
  data = await selectAgencyByID(70);
  console.log(data);
  data = await selectAgencyByID(1055);
  console.log(data);
  data = await selectAgencyByID(3187);
  console.log(data);

  console.log();
  console.log("Select all Incident IDs:");
  data = await selectAllIncidentIDs();
  console.log(data);

  console.log();
  console.log("Select information about Indicents with IDs 3, 4, 5, 8:");
  data = await selectIncidentByID(3);
  console.log(data);
  data = await selectIncidentByID(4);
  console.log(data);
  data = await selectIncidentByID(5);
  console.log(data);
  data = await selectIncidentByID(8);
  console.log(data);

  console.log();
  console.log("Select information about Agencies using the case-insensitive search term \"PoLIce\":");
  data = await selectAgencyByName("PoLIce");
  console.log(data);

  } catch (error) {
  console.error('Error selecting data', error);
  } finally {
  pool.end();
  }
};

main();
