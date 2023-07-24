const pool = require('../db/pool');


// Parameters predicates map
const paramsMap = new Map([
  ['id', 'CityID = $ARG'],
  ['idlow', 'CityID >= $ARG'],
  ['idhigh', 'CityID <= $ARG'],
  ['cityname', 'LOWER(CityName) LIKE $ARG'],
  ['county', 'LOWER(County) LIKE $ARG'],
  ['state', 'LOWER(State) LIKE $ARG'],
]);

const queryBuilder = (params) => {
  // Construct list of predicates
  const predicates = Object.keys(params).reduce((cur, param, i, arr) => {
    const predicate = paramsMap.get(param);
    if (!predicate) return cur;
    return `${cur}${predicate}${(i < arr.length - 1) ? ' AND\n' : '\n'}`;
  }, '');

  let argIndex = 1;
  const query = `
  SELECT *
  FROM City
  ${(predicates.length !== 0) ? 'WHERE ' : ''}${predicates}ORDER BY CityName
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
    console.error(`Error finding City with params ${JSON.stringify(params)}, `, error);
  } finally {
    client.release();
  }
};


const add = async (cityName, county, state) => {
  const client = await pool.connect();

  try {
    // TODO -- add a trigger to replace this query. Right now we insert only if the row doesn't exist, then search again if it does.
    const addQuery = `
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

    let result = await client.query(addQuery, [cityName, county, state]);
    if (result.rows.length == 0) {
      const retrieveQuery = `
        SELECT * FROM City
        WHERE City.CityName = $1
          AND City.County = $2
          AND City.State = $3
      `;
      result = await client.query(retrieveQuery, [cityName, county, state]);
    }

    const cityID = result.rows[0].cityid;
    return cityID;

  } catch (error) {
    console.error(`Error adding ${JSON.stringify({cityName, county, state})} to City`, error);
  } finally {
    client.release();
  }
};


module.exports = {
  find,
  add,
};
