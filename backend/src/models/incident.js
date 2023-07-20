const pool = require('../db/pool');


const paramsMap = new Map([
  ['id', 'I.IncidentID = $1'],
  ['idlow', 'I.IncidentID >= $1'],
  ['idhigh', 'I.IncidentID <= $1'],
  ['victimname', 'LOWER(V.Name) LIKE $1'],
  ['city', 'LOWER(C.CityName) LIKE $1'],
  ['county', 'LOWER(C.County) LIKE $1'],
  ['state', 'LOWER(S.State) LIKE $1'],
  ['agelow', 'V.Age >= $1'],
  ['agehigh', 'V.Age <= $1'],
  ['agencyid', 'A.AgencyID = $1'],
  ['agencyname', 'LOWER(A.AgencyName) LIKE $1'],
]);

const queryBuilder = (params) => {
  const predicates = Object.keys(params).reduce((cur, param, i, arr) => {
    const predicate = paramsMap.get(param);
    if (!predicate) return cur;
    return `${cur}${paramsMap.get(param)}${(i < arr.length - 1) ? ' AND\n' : '\n'}`;
  }, '');

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
  ${predicates}GROUP BY I.IncidentID, V.VictimID, C.CityID
  ORDER BY I.IncidentID
  `;

  return query;
};


const find = async (params) => {
  const client = await pool.connect();

  try {
    const query = queryBuilder(params);

    const result = await client.query(query, Object.values(params));

    return result.rows;

  } catch (error) {
    console.error(`Error finding in Agency with params ${JSON.stringify(params)}, `, error);
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
  find,
  add,
};
