const pool = require('../db/pool');


const findByID = async (incidentID) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE I.IncidentID = $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const result = await client.query(query, [incidentID]);

    return result.rows;

  } catch (error) {
    console.error('Error finding from Incident by ID', error);
  } finally {
    client.release();
  }
};


const findByRangeID = async (incidentIDLow = 0, incidentIDHigh = 2147483647) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE I.IncidentID >= $1 AND I.IncidentID <= $2
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const result = await client.query(query, [incidentIDLow, incidentIDHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error finding range from Incident by ID', error);
  } finally {
    client.release();
  }
};


const searchByVictimName = async (victimNameQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE LOWER(V.Name) LIKE $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const victimNameRegex = `%${victimNameQuery.toLowerCase()}%`;
    const result = await client.query(query, [victimNameRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Incident by Victim Name', error);
  } finally {
    client.release();
  }
};


const searchByCityName = async (cityNameQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE LOWER(C.CityName) LIKE $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const cityNameRegex = `%${cityNameQuery.toLowerCase()}%`;
    const result = await client.query(query, [cityNameRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Incident by CityName', error);
  } finally {
    client.release();
  }
};


const searchByCounty = async (countyQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE LOWER(C.County) LIKE $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const countyRegex = `%${countyQuery.toLowerCase()}%`;
    const result = await client.query(query, [countyRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Incident by County', error);
  } finally {
    client.release();
  }
};


const searchByState = async (stateQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE LOWER(C.State) LIKE $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const stateRegex = `%${stateQuery.toLowerCase()}%`;
    const result = await client.query(query, [stateRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Incident by State', error);
  } finally {
    client.release();
  }
};


const findByRangeAge = async (ageLow = 0, ageHigh = 214748364) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE V.Age >= $1 AND V.Age <= $2
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const result = await client.query(query, [ageLow, ageHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error finding range from Incident by Age', error);
  } finally {
    client.release();
  }
};


const findByAgencyID = async (agencyID) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE AI.AgencyID = $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const result = await client.query(query, [agencyID]);

    return result.rows;

  } catch (error) {
    console.error('Error finding from Incident by AgencyID', error);
  } finally {
    client.release();
  }
};


const searchByAgencyName = async (agencyNameQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
        I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
        V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
        JSONB_AGG(AI.AgencyID) AS AgencyIDs,
        JSONB_AGG(A.AgencyName) AS AgencyNames,
        C.CityID, C.CityName, C.County, C.State
      FROM Incident I
      LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
      LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
      LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
      LEFT OUTER JOIN City C ON I.CityID = C.CityID
      WHERE LOWER(A.AgencyName) LIKE $1
      GROUP BY I.IncidentID, V.VictimID, C.CityID
    `;

    const agencyNameRegex = `%${agencyNameQuery.toLowerCase()}%`;
    const result = await client.query(query, [agencyNameRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Incident by Agency Name', error);
  } finally {
    client.release();
  }
};


const add = async (
  incidentID, victimID, cityID, date, threatenType, fleeStatus, armedWith,
  wasMentalIllnessRelated, bodyCamera, latitude, longitude, agencyIDList
) => {
  const client = await pool.connect();

  try {
    const addIncidentQuery = `
      INSERT INTO Incident (
        IncidentID, victimID, cityID, Date, ThreatenType, FleeStatus, ArmedWith,
        WasMentalIllnessRelated, BodyCamera, Latitude, Longitude
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    await client.query(addIncidentQuery, [
      incidentID, victimID, cityID, date, threatenType, fleeStatus, armedWith,
      wasMentalIllnessRelated, bodyCamera, latitude, longitude,
    ]);

    if (agencyIDList.length > 0 && agencyIDList[0] !== null && !isNaN(agencyIDList[0])) {
      agencyIDListString = agencyIDList.toString();
      const addAgenciesInvolvedQuery = `
        INSERT INTO AgenciesInvolved (IncidentID, AgencyID)
        VALUES ($1, UNNEST(ARRAY[${agencyIDListString}]))
      `;

      await client.query(addAgenciesInvolvedQuery, [incidentID]);
    }

  } catch (error) {
    console.error(`Error adding ${JSON.stringify({
      incidentID, victimID, cityID, date, threatenType, fleeStatus, armedWith,
      wasMentalIllnessRelated, bodyCamera, latitude, longitude, agencyIDList})}
      to Incident`, error);
  } finally {
    client.release();
  }
};


module.exports = {
  findByID,
  findByRangeID,
  searchByVictimName,
  searchByCityName,
  searchByCounty,
  searchByState,
  findByRangeAge,
  findByAgencyID,
  searchByAgencyName,
  add,
};
