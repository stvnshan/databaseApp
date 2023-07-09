const pool = require('../db/pool');


const findByID = async (victimID) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM Victim
      WHERE VictimID = $1 
    `;

    const result = await client.query(query, [victimID]);

    return result.rows;

  } catch (error) {
    console.error('Error finding from Victim by ID', error);
  } finally {
    client.release();
  }
};


const findByRangeID = async (victimIDLow = 0, victimIDHigh = 2147483647) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM Victim
      WHERE VictimID >= $1 AND VictimID <= $2
    `;

    const result = await client.query(query, [victimIDLow, victimIDHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error finding range from Victim by ID', error);
  } finally {
    client.release();
  }
};


const searchByName = async (victimNameQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM Victim
      WHERE LOWER(Name) LIKE $1
    `;

    const victimNameRegex = `%${victimNameQuery.toLowerCase()}%`;
    const result = await client.query(query, [victimNameRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through Victim by Name', error);
  } finally {
    client.release();
  }
};


const findByRangeAge = async (ageLow = 0, ageHigh = 214748364) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM Victim
      WHERE Age >= $1 AND Age <= $2
    `;

    const result = await client.query(query, [ageLow, ageHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error finding range from Victim by Age', error);
  } finally {
    client.release();
  }
};


const findByGender = async (gender) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM Victim
      WHERE Gender = $1
    `;

    const result = await client.query(query, [gender]);

    return result.rows;

  } catch (error) {
    console.error('Error finding from Victim by Gender', error);
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

    const result = await client.query(addQuery, [name, age, gender, race, raceSource]);
    const victimID = result.rows[0].victimid;
    return victimID;

  } catch (error) {
    console.error('Error adding to Victim', error);
  } finally {
    client.release();
  }
};


module.exports = {
  findByID,
  findByRangeID,
  searchByName,
  findByRangeAge,
  findByGender,
  add,
};
