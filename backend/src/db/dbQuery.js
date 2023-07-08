const pool = require('./pool');

////////////////////////////////////////////////////////////////////////////////
// dbQuery.js
// Data layer that runs individual queries on the database.
////////////////////////////////////////////////////////////////////////////////

const selectAllVictimIDs = async () => {
  try {
  const client = await pool.connect();

  const query = 'SELECT VictimID, Name FROM Victim ORDER BY VictimID ASC';
  const result = await client.query(query);

  const data = result.rows;

  client.release();
  console.log('VictimIDs selected from Victim table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting VictimID', error);
  }
}


const selectAllAgencyIDs = async () => {
  try {
  const client = await pool.connect();

  const query = `
    SELECT AgencyID, AgencyName FROM Agency ORDER BY AgencyID ASC
  `;
  const result = await client.query(query);

  const data = result.rows;

  client.release();
  console.log('AgencyIDs selected from Agency table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting AgencyID', error);
  }
};


const selectAllIncidentIDs = async () => {
  try {
  const client = await pool.connect();

  const query = `
    SELECT IncidentID FROM Incident ORDER BY IncidentID ASC
  `;
  const result = await client.query(query);

  const data = result.rows;

  client.release();
  console.log('IncidentIDs selected from Incident table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting IncidentID', error);
  }
};


const selectVictimByID = async (victimID) => {
  try {
  const client = await pool.connect();

  const query = `
    SELECT *
    FROM Victim
    WHERE VictimID = $1
  `;
  const result = await client.query(query, [victimID]);

  const data = result.rows;

  client.release();
  console.log('Victim information selected from Victim table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting Victim information', error);
  }
};


const selectAgencyByID = async (agencyID) => {
  try {
  const client = await pool.connect();

  const query = `
    SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings, JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
    FROM Agency A
    LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
    LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
    WHERE A.AgencyID = $1
    GROUP BY A.AgencyID
  `;
  const result = await client.query(query, [agencyID]);

  const data = result.rows;

  client.release();
  console.log('Agency information selected from Agency table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting Victim information', error);
  }
};


const selectIncidentByID = async (incidentID) => {
  try {
  const client = await pool.connect();

  const query = `
    SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
      I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
      V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
      JSONB_AGG(AI.AgencyID) as AgencyIDs,
      C.CityName, C.County, C.State
    FROM Incident I
    LEFT OUTER JOIN Victim V ON I.VictimID = HV.VictimID
    LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
    LEFT OUTER JOIN City C ON I.CityID = C.CityID
    WHERE I.IncidentID = $1
    GROUP BY I.IncidentID, V.VictimID, C.CityName
  `;
  const result = await client.query(query, [incidentID]);

  const data = result.rows;

  client.release();
  console.log('Incident information selected from Incident table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting Incident information', error);
  }
};


const selectAgencyByName = async (agencyName) => {
  try {
  const client = await pool.connect();
  const agencyNameRegex = `%${agencyName.toLowerCase()}%`;

  const query = `
    SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings, JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
    FROM Agency A
    LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
    LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
    WHERE LOWER(A.AgencyName) LIKE $1
    GROUP BY A.AgencyID
  `;
  const result = await client.query(query, [agencyNameRegex]);

  const data = result.rows;

  client.release();
  console.log('Agency information selected from Agency table successfully');
  return data;
  } catch (error) {
  console.error('Error selecting Agency information', error);
  }
};


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


const insertIntoORICodeTable = async (agencyID, ORICode) => {
  try {
  const client = await pool.connect();

  const insertQuery = `
    INSERT INTO ORICode (AgencyID, ORI)
    VALUES ($1, $2)
  `;

  await client.query(insertQuery, [agencyID, ORICode]);

  client.release();
  console.log('Data inserted into ORICode table successfully');
  } catch (error) {
  console.error('Error inserting data into ORICode table', error);
  }
};


const insertIntoCityTable = async (cityName, county, state) => {
    try {
    const client = await pool.connect();

    // TODO
    const insertQuery = `
      INSERT INTO City (CityName, County, State)
      SELECT * FROM (
          VALUES ($1, $2, $3)
      ) AS newCity(CityName, County, State)
      WHERE NOT EXISTS (
          SELECT 1 FROM City
          WHERE CityName = newCity.CityName
            AND County = newCity.County
            AND State = newCity.State
      )
      RETURNING CityID
    `;

    const result = await client.query(insertQuery, [cityName, county, state]);

    // Return -1 if city already exists
    const cityID = result.rows.length > 0 ? result.rows[0].cityid : -1;

    client.release();
    console.log(`Data inserted into City table successfully. CityID: ${cityID}`);
    return cityID;
    } catch (error) {
    console.error('Error inserting data into City table', error);
    }
};


const insertIntoIncidentTable = async (
    incidentID,
    victimID,
    cityID,
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
        victimID,
        cityID,
        Date,
        ThreatenType,
        FleeStatus,
        ArmedWith,
        WasMentalIllnessRelated,
        BodyCamera,
        Latitude,
        Longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await client.query(insertQuery, [
      incidentID,
      victimID,
      cityID,
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
    const victimID = result.rows[0].victimid;

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


module.exports = {
  selectAllVictimIDs,
  selectAllAgencyIDs,
  selectAllIncidentIDs,
  selectVictimByID,
  selectAgencyByID,
  selectIncidentByID,
  selectAgencyByName,
  insertIntoIncidentTable,
  insertIntoVictimTable,
  insertIntoCityTable,
  insertIntoAgencyTable,
  insertIntoORICodeTable,
  insertIntoAgenciesInvolvedTable,
};
