const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');


const parseIntParam = (field) => {
  if (isNaN(field)) {
    throw new Error(`invalid int: ${field}`);
  }
  return Math.floor(Number(field));
}

const parseStringParam = (field) => {
  return field.trim().toLowerCase();
}


// Retrieve an entry from Incident
// route: GET /api/incident:id,idlow,idhigh,victimname,city,county,state,agelow,agehigh,agencyid,agencyname
const getIncident = async (req, res) => {
  try {
    const { id, idlow, idhigh, victimname, city, county, state, agelow, agehigh, agencyid, agencyname, page } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, idlow, idhigh, victimname, city, county, state, agelow, agehigh, agencyid, agencyname, page })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        if (!isNaN(attr[1]) && attr[1].length !== 0) return [attr[0], parseIntParam(attr[1])];
        else return [attr[0], parseStringParam(attr[1])];
      })
    );

    const result = await incident.find(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Incident', error);
    res.status(500).json({error: 'Internal server error'});
  }
};


// Set incident
// TODO -- need to consider how to handle ID creation
// could just do a max query and add 1 lol


// Retrieve an entry from Victim
// route: GET /api/victim/:id,idlow,idhigh,name,agelow,agehigh,gender
const getVictim = async (req, res) => {
  try {
    const { id, idlow, idhigh, name, agelow, agehigh, gender, page } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, idlow, idhigh, name, agelow, agehigh, gender, page })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        if (!isNaN(attr[1]) && attr[1].length !== 0) return [attr[0], parseIntParam(attr[1])];
        else return [attr[0], parseStringParam(attr[1])];
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
    let { id, idlow, idhigh, name, shootlow, shoothigh, state, page } = req.query;

    const query = Object.fromEntries(
      Object.entries({ id, idlow, idhigh, name, shootlow, shoothigh, state, page })
      .filter((attr) => attr[1] !== undefined)
      .map((attr) => {
        if (!isNaN(attr[1]) && attr[1].length !== 0) return [attr[0], parseIntParam(attr[1])];
        else return [attr[0], parseStringParam(attr[1])];
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
        if (!isNaN(attr[1]) && attr[1].length !== 0) return [attr[0], parseIntParam(attr[1])];
        else return [attr[0], parseStringParam(attr[1])];
      })
    );

    const result = await agency.findBrief(query);

    res.status(200).json(result);
  } catch (error){
    console.error('Error handling GET Agency (brief)', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

module.exports = {
  getIncident,
  getVictim,
  getAgency,
  getAgencyBrief,
};
