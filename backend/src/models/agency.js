const pool = require('../db/pool');


const findByID = async (agencyID) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings,
        JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
      FROM Agency A
      LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
      LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
      WHERE A.AgencyID = $1
      GROUP BY A.AgencyID
    `;

    const result = await client.query(query, [agencyID]);

    return result.rows;

  } catch (error) {
    console.error('Error finding from Agency by ID', error);
  } finally {
    client.release();
  }
};


const findByRangeID = async (agencyIDLow = 0, agencyIDHigh = 2147483647) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings,
        JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
      FROM Agency A
      LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
      LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
      WHERE A.AgencyID >= $1 AND A.AgencyID <= $2
      GROUP BY A.AgencyID
    `;

    const result = await client.query(query, [agencyIDLow, agencyIDHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error fnding range from Agency by ID', error);
  } finally {
    client.release();
  }
};


const searchByName = async (agencyNameQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings,
        JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
      FROM Agency A
      LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
      LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
      WHERE LOWER(A.AgencyName) LIKE $1
      GROUP BY A.AgencyID
    `;

    const agencyNameRegex = `%${agencyNameQuery.toLowerCase()}%`;
    const result = await client.query(query, [agencyNameRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Agency by Name', error);
  } finally {
    client.release();
  }
};


const searchByState = async (agencyStateQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings,
        JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
      FROM Agency A
      LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
      LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
      WHERE LOWER(A.State) LIKE $1
      GROUP BY A.AgencyID
    `;

    const agencyStateRegex = `%${agencyStateQuery.toLowerCase()}%`;
    const result = await client.query(query, [agencyStateRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Agency by State', error);
  } finally {
    client.release();
  }
};


const findByRangeTotalIncidents = async (totalIncidentsLow = 0, totalIncidentsHigh = 2147483647) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings,
        JSONB_AGG(AI.IncidentID) AS IncidentIDs, JSONB_AGG(O.ori) AS OriCodes
      FROM Agency A
      LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
      LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
      WHERE A.TotalShootings >= $1 AND A.TotalShootings <= $2
      GROUP BY A.AgencyID
    `;

    const result = await client.query(query, [totalIncidentsLow, totalIncidentsHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error fnding range from Agency by Total Incidents', error);
  } finally {
    client.release();
  }
};


const add = async (agencyID, agencyName, type, state, totalShootings, ORICodesList) => {
  const client = await pool.connect();

  try {
    const addAgencyQuery = `
      INSERT INTO Agency (AgencyID, AgencyName, Type, State, TotalShootings)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await client.query(addAgencyQuery, [agencyID, agencyName, type, state, totalShootings]);

    ORICodesList = ORICodesList.filter(n => n != "");

    if (ORICodesList.length > 0) {
      const ORICodesListString = "'" + ORICodesList.join("','") + "'";
      const addORICodesQuery = `
        INSERT INTO ORICode(AgencyID, ORI)
        VALUES ($1, UNNEST(ARRAY[${ORICodesListString}]))
      `;

      await client.query(addORICodesQuery, [agencyID]);
    }

  } catch (error) {
    console.error('Error adding to Agency', error);
  } finally {
    client.release();
  }
};


module.exports = {
  findByID,
  findByRangeID,
  searchByName,
  searchByState,
  findByRangeTotalIncidents,
  add,
}
