const pool = require('../db/pool');


const findByID = async (cityID) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM City
      WHERE CityID = $1 
    `;

    const result = await client.query(query, [cityID]);

    return result.rows;

  } catch (error) {
    console.error('Error finding from City by ID', error);
  } finally {
    client.release();
  }
};


const findByRangeID = async (cityIDLow = 0, cityIDHigh = 2147483647) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM City
      WHERE CityID >= $1 AND CityID <= $2
    `;

    const result = await client.query(query, [cityIDLow, cityIDHigh]);

    return result.rows;

  } catch (error) {
    console.error('Error finding range from City by ID', error);
  } finally {
    client.release();
  }
};


const searchByName = async (cityNameQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM City
      WHERE LOWER(CityName) LIKE $1
    `;

    const cityNameRegex = `%${cityNameQuery.toLowerCase()}%`;
    const result = await client.query(query, [cityNameRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through City by CityName', error);
  } finally {
    client.release();
  }
};


const searchByCounty = async (cityCountyQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM City
      WHERE LOWER(County) LIKE $1
    `;

    const cityCountyRegex = `%${cityCountyQuery.toLowerCase()}%`;
    const result = await client.query(query, [cityCountyRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through City by County', error);
  } finally {
    client.release();
  }
};


const searchByState = async (cityStateQuery) => {
  const client = await pool.connect();

  try {
    const query = `
      SELECT *
      FROM City
      WHERE LOWER(State) LIKE $1
    `;

    const cityStateRegex = `%${cityStateQuery.toLowerCase()}%`;
    const result = await client.query(query, [cityStateRegex]);

    return result.rows;

  } catch (error) {
    console.error('Error searching through City by State', error);
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
  findByID,
  findByRangeID,
  searchByName,
  searchByCounty,
  searchByState,
  add,
};
