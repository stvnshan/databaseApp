const pool = require('../db/pool');


const paramsMap = new Map([
  ['id', 'VictimID = $1'],
  ['idlow', 'VictimID >= $1'],
  ['idhigh', 'VictimID <= $1'],
  ['name', 'LOWER(Name) LIKE $1'],
  ['agelow', 'Age >= $1'],
  ['agehigh', 'Age <= $1'],
  ['gender', 'LOWER(Gender) LIKE $1'],
]);

const queryBuilder = (params) => {
  const predicates = Object.keys(params).reduce((cur, param, i, arr) => {
    const predicate = paramsMap.get(param);
    if (!predicate) return cur;
    return `${cur}${paramsMap.get(param)}${(i < arr.length - 1) ? ' AND\n' : '\n'}`;
  }, '');

  const query = `
  SELECT *
  FROM Victim
  ${predicates}ORDER BY VictimID
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
