const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');


const parseIntParam = (field) => {
  if (isNaN(field)) {
    throw new Error(`invalid int: ${field}`);
  }
  return Math.floor(Number(field));
};

const parseFloatParam = (field) => {
  if (isNaN(field)) {
    throw new Error(`invalid float: ${field}`);
  }
  return Number(field);
};

const parseStringParam = (field) => {
  return field.trim().toLowerCase();
};

const parseStateCodeParam = (field) => {
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
    'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
    'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
    'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
  ];

  const stateCode = field.trim().toUpperCase();

  if (!states.includes(stateCode)) {
    throw new Error(`invalid state code: ${field}`);
  }
  return stateCode;
};

const parseIntListParam = (field) => {
  const intStrings = [].concat(field);
  const intList = [];
  for (let i = 0; i < intStrings.length; ++i) {
    intList.push(parseIntParam(intStrings[i]));
  }
  return intList;
};

const parseMap = new Map([
  ['id', parseIntParam],
  ['idlow', parseIntParam],
  ['idhigh', parseIntParam],
  ['name', parseStringParam],
  ['victimname', parseStringParam],
  ['city', parseStringParam],
  ['cityname', parseStringParam],
  ['county', parseStringParam],
  ['state', parseStateCodeParam],
  ['age', parseIntParam],
  ['agelow', parseIntParam],
  ['agehigh', parseIntParam],
  ['gender', parseStringParam],
  ['race', parseStringParam],
  ['raceSource', parseStringParam],
  ['date', parseStringParam],
  ['threatenType', parseStringParam],
  ['fleeStatus', parseStringParam],
  ['armedWith', parseStringParam],
  ['wasMentalIllnessInvolved', parseStringParam],
  ['bodyCamera', parseStringParam],
  ['latitude', parseFloatParam],
  ['longitude', parseFloatParam],
  ['longlow', parseFloatParam],
  ['longhigh', parseFloatParam],
  ['latlow', parseFloatParam],
  ['lathigh', parseFloatParam],
  ['agencyid', parseIntListParam],
  ['agencyname', parseStringParam],
  ['shootlow', parseIntParam],
  ['shoothigh', parseIntParam],
]);

// Retrieve an entry from Incident
// route: GET /api/incident:id,idlow,idhigh,victimname,city,county,state,agelow,agehigh,agencyid,agencyname
const getIncident = async (req, res) => {
  try {
    const { id, idlow, idhigh, victimname, city, county, state, agelow, agehigh, agencyid, agencyname } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, idlow, idhigh, victimname, city, county, state, agelow, agehigh, agencyid, agencyname })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        const parse = parseMap.get(attr[0]);
        return [attr[0], parse(attr[1])];
      })
    );

    const result = await incident.find(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Incident', error);
    res.status(500).json({error: 'Internal server error'});
  }
};


// Retrieve ID, coordinates, and victim name from Incident
// route: GET /api/incidentbrief:longlow,longhigh,latlow,lathigh
const getIncidentBrief = async (req, res) => {
  try {
    const {longlow, longhigh, latlow, lathigh} = req.query;

    const query = Object.fromEntries(
      Object.entries({longlow, longhigh, latlow, lathigh})
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        const parse = parseMap.get(attr[0]);
        return [attr[0], parse(attr[1])];
      })
    );

    const result = await incident.findBrief(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Incident', error);
    res.status(500).json({error: 'Internal server error'});
  }
};


// Create a new Incident
// route: POST /api/incident:victimname,age,gender,race,raceSource,
//            cityname,county,state,date,threatenType,fleeStatus,armedWith,
//            wasMentalIllnessInvolved,bodyCamera,latitude,longitude,
//            agencyid[]
const setIncident = async (req, res) => {
  try {
    const {
      victimname, age, gender, race, raceSource, cityname, county, state, date, 
      threatenType, fleeStatus, armedWith, wasMentalIllnessInvolved, bodyCamera, 
      latitude, longitude, agencyid
    } = req.body;

    const params = Object.fromEntries(
      Object.entries({
        victimname, age, gender, race, raceSource, cityname, county, state, date, 
        threatenType, fleeStatus, armedWith, wasMentalIllnessInvolved, bodyCamera, 
        latitude, longitude, agencyid
      })
      .map((attr) => {
        if (attr[1]) {
          const parse = parseMap.get(attr[0]);
          return [attr[0], parse(attr[1])];
        }
        return [attr[0], null];
      })
    );

    const cityID = await city.add(params.city, params.county, params.state);
    const victimID = await victim.add(params.victimname, params.age, params.gender, params.race, params.raceSource);
    const incidentID = await incident.maxID() + 1;

    const query = {
      incidentID: incidentID, victimID: victimID, cityID: cityID, date: params.date, threatenType: params.threatenType,
      fleeStatus: params.fleeStatus, armedWith: params.armedWith, wasMentalIllnessInvolved: params.wasMentalIllnessInvolved,
      bodyCamera: params.bodyCamera, latitude: params.latitude, longitude: params.longitude, agencyIDList: params.agencyid
    };

    await incident.add(...Object.values(query));

    res.status(200).json(`Successfully added ${JSON.stringify(query)}`);
  } catch (error){
    console.error('Error handling SET Incident', error);
    res.status(500).json({error: 'Internal server error'});
  }
}

// Retrieve mental illness number and armed number from Incident
// route: GET /api/selectAge: age
const getAge = async (req, res) => {
  try{
    const { age } = req.query;

    const query = Object.fromEntries(
      Object.entries({ age })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) =>{
        const parse = parseMap.get(attr[0]);
        return [attr[0], parse(attr[1])];
      })
    );

    const result = await incident.selectAge(query);

    res.status(200).json(result);

  }catch(error){
    console.error('Error handling GET getAge', error);
    res.status(500).json({error: 'Internal server error'});
  }

};


// Retrieve an entry from Victim
// route: GET /api/victim/:id,idlow,idhigh,name,agelow,agehigh,gender
const getVictim = async (req, res) => {
  try {
    const { id, idlow, idhigh, name, agelow, agehigh, gender } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, idlow, idhigh, name, agelow, agehigh, gender })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        const parse = parseMap.get(attr[0]);
        return [attr[0], parse(attr[1])];
      })
    );

    const result = await victim.find(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Victim', error);
    res.status(500).json({error: 'Internal server error'});
  }
};


// Retrieve an entry in Agency
// route: GET /api/agency/:id,idlow,idhigh,name,shootlow,shoothigh,state
const getAgency = async (req, res) => {
  try {
    let { id, idlow, idhigh, name, shootlow, shoothigh, state } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, idlow, idhigh, name, shootlow, shoothigh, state })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        const parse = parseMap.get(attr[0]);
        return [attr[0], parse(attr[1])];
      })
    );

    const result = await agency.find(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Agency', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Retrieve ID and name from Agency
// route: GET /api/agencybrief/:id,name
const getAgencyBrief = async (req, res) => {
  try {
    let { id, name } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, name })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        const parse = parseMap.get(attr[0]);
        return [attr[0], parse(attr[1])];
      })
    );

    const result = await agency.findBrief(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Agency (brief)', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Retrieve body cam percentage for a given Agency
// route: GET /api/bodycamPercentage/:id
const getBodyCamPercentage = async (req, res) => {
  try {
      let agencyId = req.query.id;

      if (!agencyId) {
          return res.status(400).json({ error: 'Agency ID is required' });
      }

      const percentage = await incident.computeBodyCamPercentage(agencyId);
      res.status(200).json({ bodyCamPercentage: percentage.toFixed(2) });

  } catch (error) {
      console.error('Error in retrieving body cam percentage:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getIncident,
  getIncidentBrief,
  setIncident,
  getAge,
  getVictim,
  getAgency,
  getAgencyBrief,
  getBodyCamPercentage,
};
