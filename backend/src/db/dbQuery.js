const pool = require('./dbPool');

////////////////////////////////////////////////////////////////////////////////
// dbQuery.js
// Data layer that runs individual queries on the database.
////////////////////////////////////////////////////////////////////////////////


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


module.exports = {
  insertIntoAgencyTable,
  insertIntoHasORICodesTable,
  insertIntoORICodesTable,
  insertIntoCityTable,
  insertIntoIncidentTable,
  insertIntoVictimTable,
  insertIntoAgenciesInvolvedTable,
  insertIntoHasVictimTable,
  insertIntoHappensInTable
};
