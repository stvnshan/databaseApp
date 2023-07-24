const pool = require('../db/pool');


// Parameters predicates map
const paramsMap = new Map([
  ['id', 'VictimID = $ARG'],
  ['idlow', 'VictimID >= $ARG'],
  ['idhigh', 'VictimID <= $ARG'],
  ['name', 'LOWER(Name) LIKE $ARG'],
  ['agelow', 'Age >= $ARG'],
  ['agehigh', 'Age <= $ARG'],
  ['gender', 'LOWER(Gender) LIKE $ARG'],
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
  SELECT *
  FROM Victim
  ${(predicates.length !== 0) ? 'WHERE ' : ''}${predicates}ORDER BY VictimID
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


const add = async (name, age, gender, race, raceSource) => {
  const client = await pool.connect();

  try {
    const addQuery = `
      INSERT INTO Victim (Name, Age, Gender, Race, RaceSource)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING VictimID
    `;

    if (isNaN(age)) age = null;
    const result = await client.query(addQuery, [name, age, gender, race, raceSource]);
    const victimID = result.rows[0].victimid;
    return victimID;

  } catch (error) {
    console.error(`Error adding ${JSON.stringify({name, age, gender, race, raceSource})} to Victim`, error);
  } finally {
    client.release();
  }
};


module.exports = {
  find,
  add,
};
