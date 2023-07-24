const pool = require('../db/pool');


// Parameters predicates map
const paramsMap = new Map([
  ['id', 'I.IncidentID = $ARG'],
  ['idlow', 'I.IncidentID >= $ARG'],
  ['idhigh', 'I.IncidentID <= $ARG'],
  ['victimname', 'LOWER(V.Name) LIKE $ARG'],
  ['city', 'LOWER(C.CityName) LIKE $ARG'],
  ['county', 'LOWER(C.County) LIKE $ARG'],
  ['state', 'LOWER(C.State) LIKE $ARG'],
  ['agelow', 'V.Age >= $ARG'],
  ['agehigh', 'V.Age <= $ARG'],
  ['agencyid', 'A.AgencyID = $ARG'],
  ['agencyname', 'LOWER(A.AgencyName) LIKE $ARG'],
]);

const queryBuilder = (params) => {
  // Construct list of predicates
  const predicates = Object.keys(params).reduce((cur, param, i, arr) => {
    const predicate = paramsMap.get(param);
    if (!predicate) return cur;
    return `${cur}${paramsMap.get(param)}${(i < arr.length - 1) ? ' AND\n' : '\n'}`;
  }, '');

  let argIndex = 1;
  const query = `
  SELECT I.IncidentID, I.Date, I.ThreatenType, I.FleeStatus,
    I.ArmedWith, I.WasMentalIllnessRelated, I.BodyCamera, I.Latitude, I.Longitude,
    V.VictimID, V.Name, V.Age, V.Gender, V.Race, V.RaceSource,
    JSONB_AGG(DISTINCT AI.AgencyID) AS AgencyIDs,
    JSONB_AGG(A.AgencyName) AS AgencyNames,
    C.CityID, C.CityName, C.County, C.State
  FROM Incident I
  LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
  LEFT OUTER JOIN AgenciesInvolved AI ON I.IncidentID = AI.IncidentID
  LEFT OUTER JOIN Agency A ON AI.AgencyID = A.AgencyID
  LEFT OUTER JOIN City C ON I.CityID = C.CityID
  ${(predicates.length !== 0) ? 'WHERE ' : ''}${predicates}GROUP BY I.IncidentID, V.VictimID, C.CityID
  ORDER BY I.IncidentID
  `.replace(/\$ARG/g, () => `$${argIndex++}`);

  return query;
};


const find = async (params) => {
  const client = await pool.connect();

  try {
    const query = queryBuilder(params);

    for (const p in params) {
      if (typeof params[p] === 'string') params[p] = `\%${params[p].toLowerCase()}\%`;
    }

    const result = await client.query(query, Object.values(params));

    return result.rows;

  } catch (error) {
    console.error(`Error finding Incident with params ${JSON.stringify(params)}, `, error);
  } finally {
    client.release();
  }
};


const findBrief = async (params) => {
  const client = await pool.connect();

  try {
    const query = `
    SELECT IncidentID, V.Name, date, longitude, latitude
    FROM Incident I
    LEFT OUTER JOIN Victim V ON I.VictimID = V.VictimID
    WHERE longitude > $1 AND longitude < $2 AND
          latitude > $3 AND latitude < $4
    LIMIT 300
    `;

    const result = await client.query(query, [params.longlow, params.longhigh, params.latlow, params.lathigh]);

    return result.rows;

  } catch (error) {
    console.error(`Error finding Incident (brief), `, error);
  } finally {
    client.release();
  }
};


const maxID = async () => {
  const client = await pool.connect();

  try {
    const query = `
    SELECT MAX(IncidentID)
    FROM Incident
    `;

    const result = await client.query(query, []);

    return result.rows[0].max;

  } catch (error) {
    console.error(`Error retrieving max IncidentID, `, error);
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

    if (agencyIDList && agencyIDList.length > 0 && agencyIDList[0] !== null && !isNaN(agencyIDList[0])) {
      agencyIDListString = agencyIDList.toString();
      const addAgenciesInvolvedQuery = `
        INSERT INTO AgenciesInvolved (IncidentID, AgencyID)
        VALUES ($1, UNNEST(ARRAY[${agencyIDListString}]))
      `;

      await client.query(addAgenciesInvolvedQuery, [incidentID]);
    }

    return incidentID;

  } catch (error) {
    console.error(`Error adding ${JSON.stringify([
      incidentID, victimID, cityID, date, threatenType, fleeStatus, armedWith,
      wasMentalIllnessRelated, bodyCamera, latitude, longitude, agencyIDList])}
      to Incident`, error);
  } finally {
    client.release();
  }
};


module.exports = {
  find,
  findBrief,
  maxID,
  add,
};
