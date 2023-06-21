const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'test',
    host: 'localhost',
    database: 'cs348',
    password: 'password',
    port: 5432,
});


const createTables = async () => {
  const createTableQuery = `
    CREATE TABLE Incident (
        IncidentID INT PRIMARY KEY,
        Date DATE,
        ThreatenType VARCHAR(100),
        FleeStatus VARCHAR(100),
        ArmedWith VARCHAR(100),
        WasMentalIllnessRelated BOOLEAN,
        BodyCamera BOOLEAN,
        Latitude FLOAT, 
        Longitude FLOAT
    );

    CREATE TABLE Victim (
        VictimID SERIAL PRIMARY KEY,
        Name VARCHAR(100),
        Age INT,
        Gender VARCHAR(100),
        Race VARCHAR(100),
        RaceSource VARCHAR(100)
    );

    CREATE TABLE City (
        CityName VARCHAR(100) PRIMARY KEY,
        County VARCHAR(100),
        State VARCHAR(100)
    );


    CREATE TABLE Agency (
        AgencyID INT PRIMARY KEY,
        AgencyName VARCHAR(100),
        Type VARCHAR(100),
        State VARCHAR(100),
        TotalShootings INT
    );

    CREATE TABLE ORICodes(
        ORI VARCHAR(100) PRIMARY KEY
    );

    CREATE TABLE AgenciesInvolved (
        IncidentID INT REFERENCES Incident(IncidentID),
        AgencyID INT REFERENCES Agency(AgencyID)
    );

    CREATE TABLE HasORICodes(
        AgencyID INT REFERENCES Agency(AgencyID),
        ORI VARCHAR(100) REFERENCES ORICodes(ORI)
    );

    CREATE TABLE HappensIn(
        IncidentID INT REFERENCES Incident(IncidentID),
        CityName VARCHAR(100) REFERENCES City(CityName)
    );

    CREATE TABLE HasVictim(
        VictimID INT REFERENCES Victim(VictimID),
        IncidentID INT REFERENCES Incident(IncidentID)
    );
    `;


  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  } finally {
    // pool.end();
  }
};




// POPULATE TABLES

const insertIntoAgencyTable = async (agencyID, agencyName, type, state, totalShootings) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO Agency (AgencyID, AgencyName, Type, State, TotalShootings)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await client.query(insertQuery, [agencyID, agencyName, type, state, totalShootings]);

    client.release();
    console.log('Data inserted into Agency table successfully');
  } catch (error) {
    console.error('Error inserting data into Agency table', error);
  }
};

const insertIntoHasORICodesTable = async (agencyID, ORICode) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO HasORICodes (AgencyID, ORI)
      VALUES ($1, $2)
    `;

    await client.query(insertQuery, [agencyID, ORICode]);

    client.release();
    console.log('Data inserted into HasORICodes table successfully');
  } catch (error) {
    console.error('Error inserting data into HasORICodes table', error);
  }
};

const insertIntoORICodesTable = async (ORICode) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO ORICodes (ORI)
      VALUES ($2)
    `;

    await client.query(insertQuery, [ORICode]);

    client.release();
    console.log('Data inserted into ORICodes table successfully');
  } catch (error) {
    console.error('Error inserting data into ORICodes table', error);
  }
};

const populateAgencyTableFromCSV = async () => {
  try {
    const csvData = fs.readFileSync('./fatal-police-shootings-agencies.csv', 'utf8');

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());

    const columnNameIndices = {
      agencyID: headerRow.indexOf('id'),
      agencyName: headerRow.indexOf('name'),
      type: headerRow.indexOf('type'),
      state: headerRow.indexOf('state'),
      totalShootings: headerRow.indexOf('total_shootings'),
      ORICodes: headerRow.indexOf('oricodes'),
    };

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');

      const agencyID = parseInt(rowData[columnNameIndices.agencyID].replace(/"/g, ''), 10);
      const agencyName = rowData[columnNameIndices.agencyName].replace(/"/g, '');
      const type = rowData[columnNameIndices.type].replace(/"/g, '');
      const state = rowData[columnNameIndices.state].replace(/"/g, '');
      const totalShootings = parseInt(rowData[columnNameIndices.totalShootings].replace(/"/g, ''), 10);
      const ORICodes = rowData[columnNameIndices.ORICodes].replace(/"/g, '');

      await insertIntoAgencyTable(agencyID, agencyName, type, state, totalShootings);

      const ORICodeList = ORICodes.split(';').map((ORICode) => ORICode.trim());

      // Loop through the ORI codes and insert into the HasORICodes table
      for (const ORICode of ORICodeList) {
        // await insertIntoORICodesTable(ORICode);
        // await insertIntoHasORICodesTable(agencyID, ORICode);
      }
    }

    console.log('Agency table populated successfully');
  } catch (error) {
    console.error('Error populating Agency table from CSV', error);
  } finally {
    // pool.end(); // Remove this line if you're reusing the pool elsewhere
  }
};


const insertIntoCityTable = async (cityName, county, state) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO City (CityName, County, State)
      VALUES ($1, $2, $3)
    `;

    await client.query(insertQuery, [cityName, county, state]);

    client.release();
    console.log('Data inserted into City table successfully');
  } catch (error) {
    console.error('Error inserting data into City table', error);
  }
};

const populateCityTableFromCSV = async () => {
  try {
    const csvData = fs.readFileSync('./fatal-police-shootings-data.csv', 'utf8');
    console.log(csvData);

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());
    // console.log(headerRow)

    const columnNameIndices = {
      city: headerRow.indexOf('city'),
      county: headerRow.indexOf('county'),
      state: headerRow.indexOf('state'),
    };

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');

      const cityName = rowData[columnNameIndices.city].replace(/"/g, '');
      const county = rowData[columnNameIndices.county].replace(/"/g, '');
      const state = rowData[columnNameIndices.state].replace(/"/g, '');

      await insertIntoCityTable(cityName, county, state);
    }

    console.log('City table populated successfully');
  } catch (error) {
    console.error('Error populating City table from CSV', error);
  } finally {
    // pool.end(); // Remove this line
  }
};

// populateCityTableFromCSV();


const insertIntoIncidentTable = async (
  incidentID,
  date,
  threatenType,
  fleeStatus,
  armedWith,
  wasMentalIllnessRelated,
  bodyCamera,
  latitude,
  longitude
) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO Incident (
        IncidentID,
        Date,
        ThreatenType,
        FleeStatus,
        ArmedWith,
        WasMentalIllnessRelated,
        BodyCamera,
        Latitude,
        Longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    await client.query(insertQuery, [
      incidentID,
      date,
      threatenType,
      fleeStatus,
      armedWith,
      wasMentalIllnessRelated,
      bodyCamera,
      latitude,
      longitude,
    ]);

    client.release();
    console.log('Data inserted into Incident table successfully');
  } catch (error) {
    console.error('Error inserting data into Incident table', error);
  }
};

const populateIncidentTableFromCSV = async () => {
  try {
    const csvData = fs.readFileSync('./fatal-police-shootings-data.csv', 'utf8');

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());

    const columnNameIndices = {
      incidentID: headerRow.indexOf('id'),
      date: headerRow.indexOf('date'),
      threatenType: headerRow.indexOf('threat_type'),
      fleeStatus: headerRow.indexOf('flee_status'),
      armedWith: headerRow.indexOf('armed_with'),
      wasMentalIllnessRelated: headerRow.indexOf('was_mental_illness_related'),
      bodyCamera: headerRow.indexOf('body_camera'),
      latitude: headerRow.indexOf('latitude'),
      longitude: headerRow.indexOf('longitude'),
    };

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');
      console.log(rowData[columnNameIndices.incidentID])
      const incidentID = parseInt(rowData[columnNameIndices.incidentID].replace(/"/g, ''), 10);
      const date = new Date(rowData[columnNameIndices.date].replace(/"/g, ''));
      const threatenType = rowData[columnNameIndices.threatenType].replace(/"/g, '');
      const fleeStatus = rowData[columnNameIndices.fleeStatus].replace(/"/g, '');
      const armedWith = rowData[columnNameIndices.armedWith].replace(/"/g, '');
      const wasMentalIllnessRelated = rowData[columnNameIndices.wasMentalIllnessRelated].replace(/"/g, '') === 'true';
      const bodyCamera = rowData[columnNameIndices.bodyCamera].replace(/"/g, '') === 'true';
      const latitude = parseFloat(rowData[columnNameIndices.latitude].replace(/"/g, ''));
      const longitude = parseFloat(rowData[columnNameIndices.longitude].replace(/"/g, ''));

      await insertIntoIncidentTable(
        incidentID,
        date,
        threatenType,
        fleeStatus,
        armedWith,
        wasMentalIllnessRelated,
        bodyCamera,
        latitude,
        longitude
      );
    }

    console.log('Incident table populated successfully');
  } catch (error) {
    console.error('Error populating Incident table from CSV', error);
  } finally {
    // pool.end(); // Remove this line if you're reusing the pool elsewhere
  }
};


const insertIntoVictimTable = async (name, age, gender, race, raceSource) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO Victim (Name, Age, Gender, Race, RaceSource)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING VictimID
    `;

    const result = await client.query(insertQuery, [name, age, gender, race, raceSource]);
    const victimID = result.rows[0].VictimID;

    client.release();
    console.log(`Data inserted into Victim table successfully. VictimID: ${victimID}`);
    return victimID;
  } catch (error) {
    console.error('Error inserting data into Victim table', error);
  }
};

const insertIntoAgenciesInvolvedTable = async (incidentID, agencyID) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO AgenciesInvolved (IncidentID, AgencyID)
      VALUES ($1, $2)
    `;

    await client.query(insertQuery, [incidentID, agencyID]);

    client.release();
    console.log('Data inserted into AgenciesInvolved table successfully');
  } catch (error) {
    console.error('Error inserting data into AgenciesInvolved table', error);
  }
};

const populateVictimTableFromCSV = async () => {
  try {
    const csvData = fs.readFileSync('./fatal-police-shootings-data.csv', 'utf8');

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());
    const columnNameIndices = {
      name: headerRow.indexOf('name'),
      age: headerRow.indexOf('age'),
      gender: headerRow.indexOf('gender'),
      race: headerRow.indexOf('race'),
      raceSource: headerRow.indexOf('race_source'),
      incidentID: headerRow.indexOf('id'), // Added IncidentID column index
      agencyIDs: headerRow.indexOf('agency_ids'),
    };

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');

      const name = rowData[columnNameIndices.name].replace(/"/g, '');
      const age = parseInt(rowData[columnNameIndices.age].replace(/"/g, ''), 10);
      const gender = rowData[columnNameIndices.gender].replace(/"/g, '');
      const race = rowData[columnNameIndices.race].replace(/"/g, '');
      const raceSource = rowData[columnNameIndices.raceSource].replace(/"/g, '');
      const incidentID = parseInt(rowData[columnNameIndices.incidentID].replace(/"/g, ''), 10); // Extracting IncidentID

      const victimID = await insertIntoVictimTable(name, age, gender, race, raceSource);
      await insertIntoHasVictimTable(victimID, incidentID);

      const agencyIDs = rowData[columnNameIndices.agencyIDs].replace(/"/g, '');

      // Split the agency IDs using the semicolon delimiter
      const agencyIDList = agencyIDs.split(';').map((agencyID) => parseInt(agencyID.trim(), 10));

      // Loop through the agency IDs and insert into the AgenciesInvolved table
      for (const agencyID of agencyIDList) {
        await insertIntoAgenciesInvolvedTable(incidentID, agencyID);
      }
    }

    console.log('Victim table populated successfully');
    console.log('AgenciesInvolved table populated successfully');
  } catch (error) {
    console.error('Error populating Victim table and/or AgencyInvolved table from CSV', error);
  } finally {
    // pool.end(); // Remove this line if you're reusing the pool elsewhere
  }
};

const insertIntoHasVictimTable = async (victimID, incidentID) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO HasVictim (VictimID, IncidentID)
      VALUES ($1, $2)
    `;

    await client.query(insertQuery, [victimID, incidentID]);

    client.release();
    console.log('Data inserted into HasVictim table successfully');
  } catch (error) {
    console.error('Error inserting data into HasVictim table', error);
  }
};


const insertIntoHappensInTable = async (incidentID, cityName) => {
  try {
    const client = await pool.connect();

    const insertQuery = `
      INSERT INTO HappensIn (IncidentID, CityName)
      VALUES ($1, $2)
    `;

    await client.query(insertQuery, [incidentID, cityName]);

    client.release();
    console.log('Data inserted into HappensIn table successfully');
  } catch (error) {
    console.error('Error inserting data into HappensIn table', error);
  }
};


const populateHappensInTableFromCSV = async () => {
  try {
    const csvData = fs.readFileSync('./fatal-police-shootings-data.csv', 'utf8');

    const rows = csvData.split('\n');
    const headerRow = rows[0].split(',').map((field) => field.replace(/"/g, '').trim());

    const columnNameIndices = {
      incidentID: headerRow.indexOf('id'),
      cityName: headerRow.indexOf('city'),
    };

    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(',');

      const incidentID = parseInt(rowData[columnNameIndices.incidentID].replace(/"/g, ''), 10);
      const cityName = rowData[columnNameIndices.cityName].replace(/"/g, '');

      await insertIntoHappensInTable(incidentID, cityName);
    }

    console.log('HappensIn table populated successfully');
  } catch (error) {
    console.error('Error populating HappensIn table from CSV', error);
  } finally {
    // pool.end(); // Remove this line if you're reusing the pool elsewhere
  }
};


  


const main = async () => {
  try {
    await createTables(); // Await table creation

    // Call other functions after table creation is complete
    await populateCityTableFromCSV();
    await populateAgencyTableFromCSV();
    await populateIncidentTableFromCSV();
    await populateVictimTableFromCSV();
    await populateHappensInTableFromCSV();

    console.log('Data insertion completed successfully');
  } catch (error) {
    console.error('Error inserting data', error);
  } finally {
    pool.end(); // Remove this line if you're reusing the pool elsewhere
  }
};

main();