const pool = require('./pool');
const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');
const fs = require('fs');
const testDatabase = require('./testDatabase');



////////////////////////////////////////////////////////////////////////////////
// CREATE TABLES
const createTables = async () => {
  const createTableQuery = `
    CREATE TABLE Victim (
      VictimID SERIAL PRIMARY KEY,
      Name VARCHAR(100),
      Age INT,
      Gender VARCHAR(100),
      Race VARCHAR(100),
      RaceSource VARCHAR(100)
    );

    CREATE TABLE City (
      CityID SERIAL PRIMARY KEY,
      CityName VARCHAR(100),
      County VARCHAR(100),
      State VARCHAR(100)
    );

    CREATE TABLE Incident (
      IncidentID INT PRIMARY KEY,
      VictimID INT REFERENCES Victim(VictimID),
      CityID INT REFERENCES City(CityID),
      Date DATE,
      ThreatenType VARCHAR(100),
      FleeStatus VARCHAR(100),
      ArmedWith VARCHAR(100),
      WasMentalIllnessRelated BOOLEAN,
      BodyCamera BOOLEAN,
      Latitude FLOAT, 
      Longitude FLOAT
    );

    CREATE TABLE Agency (
      AgencyID INT PRIMARY KEY,
      AgencyName VARCHAR(100),
      Type VARCHAR(100),
      State VARCHAR(100),
      TotalShootings INT
    );

    CREATE TABLE ORICode(
      AgencyID INT REFERENCES Agency(AgencyID),
      ORI VARCHAR(100),
      PRIMARY KEY(AgencyID, ORI)
    );

    CREATE TABLE AgenciesInvolved (
      IncidentID INT REFERENCES Incident(IncidentID),
      AgencyID INT REFERENCES Agency(AgencyID)
    );
  `;

  const client = await pool.connect();

  try {
    await client.query(createTableQuery);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  } finally {
    client.release();
  }
};


////////////////////////////////////////////////////////////////////////////////
// POPULATE TABLES

// Populate tables using the Agency CSV
const populateWithAgencyCSV = async (agencyCsvPath) => {
  try {
    // Read in Agency CSV
    const csvData = fs.readFileSync(agencyCsvPath, 'utf8');

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());

    // Column names
    const columnNameIndices = {
      agencyID: headerRow.indexOf('id'),
      agencyName: headerRow.indexOf('name'),
      type: headerRow.indexOf('type'),
      state: headerRow.indexOf('state'),
      ORICodes: headerRow.indexOf('oricodes'),
      totalShootings: headerRow.indexOf('total_shootings'),
    };

    // Extract fields and add to the appropriate tables
    for (let i = 1; i < rows.length - 1; i++) {
      const rowData = rows[i].split('","');

      const agencyID = parseInt(rowData[columnNameIndices.agencyID].replace(/"/g, ''), 10);
      const agencyName = rowData[columnNameIndices.agencyName].replace(/"/g, '');
      const type = rowData[columnNameIndices.type].replace(/"/g, '');
      const state = rowData[columnNameIndices.state].replace(/"/g, '');
      const totalShootingsStr = rowData[columnNameIndices.totalShootings].replace(/"/g, '');
      const totalShootings = !isNaN(totalShootingsStr) ? parseInt(totalShootingsStr, 10) : null;
      const ORICodes = rowData[columnNameIndices.ORICodes].replace(/"/g, '');

      const ORICodesList = ORICodes.split(';').map((ORICode) => ORICode.trim());

      await agency.add(agencyID, agencyName, type, state, totalShootings, ORICodesList);
    }

    console.log('Populating with Agency CSV successful');
  } catch (error) {
    console.error('Error populating from Agency CSV', error);
  }
};


const populateWithIncidentCSV = async (incidentCsvPath) => {
  try {
    // Read in Incident CSV
    const csvData = fs.readFileSync(incidentCsvPath, 'utf8');

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());

    // Column names
    const columnNameIndices = {
      // Incident fields
      incidentID: headerRow.indexOf('id'),
      date: headerRow.indexOf('date'),
      threatenType: headerRow.indexOf('threat_type'),
      fleeStatus: headerRow.indexOf('flee_status'),
      armedWith: headerRow.indexOf('armed_with'),
      wasMentalIllnessRelated: headerRow.indexOf('was_mental_illness_related'),
      bodyCamera: headerRow.indexOf('body_camera'),
      latitude: headerRow.indexOf('latitude'),
      longitude: headerRow.indexOf('longitude'),

      // City fields
      city: headerRow.indexOf('city'),
      county: headerRow.indexOf('county'),
      state: headerRow.indexOf('state'),

      // Victim fields
      name: headerRow.indexOf('name'),
      age: headerRow.indexOf('age'),
      gender: headerRow.indexOf('gender'),
      race: headerRow.indexOf('race'),
      raceSource: headerRow.indexOf('race_source'),
      agencyIDs: headerRow.indexOf('agency_ids'),
    };

    // Extract fields and add to the appropriate tables
    for (let i = 1; i < rows.length - 1; i++) {
      const rowData = rows[i].split(',');

      // City
      const cityName = rowData[columnNameIndices.city].replace(/"/g, '');
      const county = rowData[columnNameIndices.county].replace(/"/g, '');
      const state = rowData[columnNameIndices.state].replace(/"/g, '');
      // CityID
      let cityID = await city.add(cityName, county, state);

      // Victim
      const name = rowData[columnNameIndices.name].replace(/"/g, '');
      const ageStr = rowData[columnNameIndices.age].replace(/"/g, '');
      const age = !isNaN(ageStr) ? parseInt(ageStr, 10) : 0;
      const gender = rowData[columnNameIndices.gender].replace(/"/g, '');
      const race = rowData[columnNameIndices.race].replace(/"/g, '');
      const raceSource = rowData[columnNameIndices.raceSource].replace(/"/g, '');
      // VictimID
      const victimID = await victim.add(name, age, gender, race, raceSource);

      // Incident
      const incidentID = parseInt(rowData[columnNameIndices.incidentID].replace(/"/g, ''), 10);
      const date = new Date(rowData[columnNameIndices.date].replace(/"/g, ''));
      const threatenType = rowData[columnNameIndices.threatenType].replace(/"/g, '');
      const fleeStatus = rowData[columnNameIndices.fleeStatus].replace(/"/g, '');
      const armedWith = rowData[columnNameIndices.armedWith].replace(/"/g, '');
      const wasMentalIllnessRelated = rowData[columnNameIndices.wasMentalIllnessRelated].replace(/"/g, '') === 'true';
      const bodyCamera = rowData[columnNameIndices.bodyCamera].replace(/"/g, '') === 'true';
      const latitudeStr = rowData[columnNameIndices.latitude].replace(/"/g, '');
      const latitude = !isNaN(latitudeStr) ? parseFloat(latitudeStr) : null;
      const longitudeStr = rowData[columnNameIndices.longitude].replace(/"/g, '');
      const longitude = !isNaN(longitudeStr) ? parseFloat(longitudeStr) : null;

      // Agency IDs
      const agencyIDs = rowData[columnNameIndices.agencyIDs].replace(/"/g, '');
      const agencyIDList = agencyIDs.split(';').map((agencyID) => parseInt(agencyID.trim(), 10)); // Split the agency IDs using the semicolon delimiter

      await incident.add(
        incidentID, victimID, cityID, date, threatenType, fleeStatus, armedWith, wasMentalIllnessRelated,
        bodyCamera, latitude, longitude, agencyIDList
      );
    }

    console.log('Populating with Incident CSV successful');
  } catch (error) {
    console.error('Error populating from Incident CSV', error);
  }
}


const main = async () => {
  try {
    // Create tables
    await createTables();

    // Sample CSV paths
    const sampleIncidentCsvPath = 'data/sample/fatal-police-shootings-data.csv';
    const sampleAgencyCsvPath = 'data/sample/fatal-police-shootings-agencies.csv';
    // Production CSV paths
    const productionIncidentCsvPath = 'data/production/fatal-police-shootings-data.csv';
    const productionAgencyCsvPath = 'data/production/fatal-police-shootings-agencies.csv';

    let incidentCsvPath, agencyCsvPath;
    if (process.env.ENVIRONMENT == 'production') {
      incidentCsvPath = productionIncidentCsvPath;
      agencyCsvPath = productionAgencyCsvPath;
    } else if (process.env.ENVIRONMENT == 'sample') {
      incidentCsvPath = sampleIncidentCsvPath;
      agencyCsvPath = sampleAgencyCsvPath;
    }

    // Populate tables
    await populateWithAgencyCSV(agencyCsvPath);
    await populateWithIncidentCSV(incidentCsvPath);

    // Run unit tests
    await testDatabase();

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database', error);
  } finally {
    pool.end();
  }
};

main();
