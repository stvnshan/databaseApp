const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: '@Swz030104',
    port: 5432,
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });

  
const agencyPath = "./fatal-police-shootings-agencies.txt";
const shootingPath = "./fatal-police-shootings-data.txt"; 
const importAgencies = async () => {
  try {
    fs.readFile(agencyPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the CSV file', err);
            return;
        }
        const rows = data.split('\n'); 
        for (let i = 1; i < rows.length; i++) {
            values = rows[i].split(',');
            //0->id
            //1->name
            //2->type
            //3->state
            //4->oricodes
            //5->total_shootings
            
            const query1 = 'INSERT INTO Agency(AgencyID,AgencyName,Type,State,TotalShootings) VALUES ($1,$2,$3,$4,$5)';
            const params1 = [parseInt(values[0]),values[1],values[2],values[3],parseInt(values[5])]; 
            pool.query(query1, params1)

            const query2 = 'INSERT INTO ORICodes(ORI) VALUES ($1) ON DUPLICATE KEY UPDATE ORI = ORI' ;
            const params2 = [values[4]]; 
            pool.query(query2, params2)
            
            const query3 = 'INSERT INTO HasORICodes(AgencyID,ORI) VALUES ($1,$2)' ;
            const params3 = [parseInt(values[0]),values[4]]; 
            pool.query(query3, params3)

            .then(() => {
                console.log(`Inserted row ${i} into the database`);
            })
            .catch((err) => {
                console.error(`Error inserting row ${i} into the database`, err);
            });
        }
        }
    );
    console.log('populate1 successfully');
  } catch (error) {
    console.error('Error populate1', error);
  }
};

const importShootingData = async () =>{
    try {
    fs.readFile(shootingPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the CSV file', err);
            return;
        }
        const rows = data.split('\n'); 
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(','); 
            //0->"id"
            //1->"date"
            //2->"threat_type"
            //3->"flee_status"
            //4->"armed_with"
            //5->"city"
            //6->"county"
            //7->"state"
            //8->"latitude"
            //9->"longitude"
            //10->"location_precision"
            //11->"name"
            //12->"age"
            //13->"gender"
            //14->"race"
            //15->"race_source"
            //16->"was_mental_illness_related"
            //17->"body_camera"
            //18->"agency_ids"
        
            const query1 = 'INSERT INTO Incident(IncidentID,Date,ThreatType,FleeStatus,ArmedWith,Latitude,Longitude,WasMentalIllnessRelated,BodyCamera) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)';
            const params1 = [values[0],values[1],values[2],values[3],values[4],values[8],values[9],values[16],values[17]]; 
            pool.query(query1, params1)

            const query2 = 'INSERT INTO Victim(VictimID,Name,Age,Gender,Race,RaceSource) VALUES ($1,$2,$3,$4,$5,$6) ON DUPLICATE KEY UPDATE VictimID = VictimID' ;
            const params2 = [i,values[11],values[12],values[13],values[14],values[15]]; 
            pool.query(query2, params2)
            
            const query3 = 'INSERT INTO City(CityName,County,State) VALUES ($1,$2,$3) ON DUPLICATE KEY UPDATE CityName = CityName' ;
            const params3 = [values[5],values[6],values[7]]; 
            pool.query(query3, params3)

            const query4 = 'INSERT INTO HappensIn(IncidentID,CityName) VALUES ($1,$2) ON DUPLICATE KEY UPDATE CityName = CityName' ;
            const params4 = [values[0],values[5]]; 
            pool.query(query4, params4)

            const query5 = 'INSERT INTO HasVictim(IncidentID,VictimID) VALUES ($1,$2) ON DUPLICATE KEY UPDATE IncidentID = IncidentID' ;
            const params5 = [values[0],i]; 
            pool.query(query5, params5)

            .then(() => {
                console.log(`Inserted row ${i} into the database`);
            })
            .catch((err) => {
                console.error(`Error inserting row ${i} into the database`, err);
            });
        }
        }
    );
    console.log('populate2 successfully');
  } catch (error) {
    console.error('Error populate2', error);
  }
};

importAgencies();
//importShootingData();