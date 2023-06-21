const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: '@Swz030104',
    port: 5432,
});


const createTables = async () => {
  const createTableQuery = `
    CREATE TABLE Incident (
        IncidentID INT PRIMARY KEY,
        Date DATE,
        ThreatenType VARCHAR(100),
        FleeStatus VARCHAR(100),
        ArmedWith VARCHAR(100),
        WasMentalIllnessRelated BOOLEAN,
        BodyCamera BOOLEAN,
        Latitude FLOAT, 
        Longitude FLOAT
    );

    CREATE TABLE Victim (
        VictimID INT PRIMARY KEY,
        Name VARCHAR(100),
        Age INT,
        Gender VARCHAR(100),
        Race VARCHAR(100),
        RaceSource VARCHAR(100)
    );

    CREATE TABLE City (
        CityName VARCHAR(100) PRIMARY KEY,
        County VARCHAR(100),
        State VARCHAR(100)
    );


    CREATE TABLE Agency (
        AgencyID INT PRIMARY KEY,
        AgencyName VARCHAR(100),
        Type VARCHAR(100),
        State VARCHAR(100),
        TotalShootings INT
    );

    CREATE TABLE ORICodes(
        ORI VARCHAR(100) PRIMARY KEY
    );

    CREATE TABLE AgenciesInvolved (
        IncidentID INT REFERENCES Incident(IncidentID),
        AgencyID INT REFERENCES Agency(AgencyID)
    );

    CREATE TABLE HasORICodes(
        AgencyID INT REFERENCES Agency(AgencyID),
        ORI VARCHAR(100) REFERENCES ORICodes(ORI)
    );

    CREATE TABLE HappensIn(
        IncidentID INT REFERENCES Incident(IncidentID),
        CityName VARCHAR(100) REFERENCES City(CityName)
    );

    CREATE TABLE HasVictim(
        VictimID INT REFERENCES Victim(VictimID),
        IncidentID INT REFERENCES Incident(IncidentID)
    );
    `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  } finally {
    pool.end();
  }
};

createTables();

  
  