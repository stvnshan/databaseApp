const pool = require('../db/pool');


const paramsMap = new Map([
  ['id', 'A.AgencyID = $ARG'],
  ['idlow', 'A.AgencyID >= $ARG'],
  ['idhigh', 'A.AgencyID <= $ARG'],
  ['name', 'LOWER(A.AgencyName) LIKE $ARG'],
  ['shootlow', 'A.TotalShootings >= $ARG'],
  ['shoothigh', 'A.TotalShootings <= $ARG'],
  ['state', 'LOWER(A.State) LIKE $ARG'],
]);

const queryBuilder = (params) => {
  const predicates = Object.keys(params).reduce((cur, param, i, arr) => {
    const predicate = paramsMap.get(param);
    if (!predicate) return cur;
    return `${cur}${paramsMap.get(param)}${(i < arr.length - 1) ? ' AND\n' : '\n'}`;
  }, '');

  let argIndex = 1;
  const query = `
  SELECT A.AgencyID, A.AgencyName, A.Type, A.State, A.TotalShootings,
    JSONB_AGG(DISTINCT AI.IncidentID) AS IncidentIDs, JSONB_AGG(DISTINCT O.ori) AS OriCodes
  FROM Agency A
  LEFT OUTER JOIN AgenciesInvolved AI ON A.AgencyID = AI.AgencyID
  LEFT OUTER JOIN ORICode O ON A.AgencyID = O.AgencyID
  ${(predicates.length !== 0) ? 'WHERE ' : ''}${predicates}GROUP BY A.AgencyID
  ORDER BY A.AgencyName
  `.replace(/\$ARG/g, () => `$${argIndex++}`);

  return query;
};


const find = async (params) => {
  const client = await pool.connect();

  try {
    const query = queryBuilder(params);

    for (const p in params) {
      if (typeof params[p] === 'string') params[p] = `%${params[p].toLowerCase()}%`;
    }

    const result = await client.query(query, Object.values(params));

    return result.rows;

  } catch (error) {
    console.error(`Error finding Agency with params ${JSON.stringify(params)}, `, error);
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
    console.error(`Error adding ${JSON.stringify({agencyID, agencyName, type, state, totalShootings})} to Agency`, error);
  } finally {
    client.release();
  }
};


module.exports = {
  find,
  add,
}
