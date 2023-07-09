const pool = require('./pool');
const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');
const fs = require('fs');
const testDatabase = require('./testDatabase');

// Sample data paths
const incidentCsvPath = 'data/sample/fatal-police-shootings-data.csv';
const agencyCsvPath = 'data/sample/fatal-police-shootings-agencies.csv';


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
const populateWithAgencyCSV = async () => {
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
      totalShootings: headerRow.indexOf('total_shootings'),
      ORICodes: headerRow.indexOf('oricodes'),
    };

    // Extract fields and add to the appropriate tables
    for (let i = 1; i < rows.length - 2; i++) {
      const rowData = rows[i].split(',');

      const agencyID = parseInt(rowData[columnNameIndices.agencyID].replace(/"/g, ''), 10);
      const agencyName = rowData[columnNameIndices.agencyName].replace(/"/g, '');
      const type = rowData[columnNameIndices.type].replace(/"/g, '');
      const state = rowData[columnNameIndices.state].replace(/"/g, '');
      const totalShootings = parseInt(rowData[columnNameIndices.totalShootings].replace(/"/g, ''), 10);
      const ORICodes = rowData[columnNameIndices.ORICodes].replace(/"/g, '');

      const ORICodesList = ORICodes.split(';').map((ORICode) => ORICode.trim());

      await agency.add(agencyID, agencyName, type, state, totalShootings, ORICodesList);
    }

    console.log('Populating with Agency CSV successful');
  } catch (error) {
    console.error('Error populating from Agency CSV', error);
  }
};


const populateWithIncidentCSV = async () => {
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
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');

      // City
      const cityName = rowData[columnNameIndices.city].replace(/"/g, '');
      const county = rowData[columnNameIndices.county].replace(/"/g, '');
      const state = rowData[columnNameIndices.state].replace(/"/g, '');
      // CityID
      const cityID = await city.add(cityName, county, state);

      // Victim
      const name = rowData[columnNameIndices.name].replace(/"/g, '');
      const age = parseInt(rowData[columnNameIndices.age].replace(/"/g, ''), 10);
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
      const latitude = parseFloat(rowData[columnNameIndices.latitude].replace(/"/g, ''));
      const longitude = parseFloat(rowData[columnNameIndices.longitude].replace(/"/g, ''));

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

    // Populate tables
    await populateWithAgencyCSV();
    await populateWithIncidentCSV();

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
