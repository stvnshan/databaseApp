const incident = require('../models/incident.js');incident
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');


// Get from Incident
// route: GET /api/incident:id,idlow,idhigh,victimname,city,county,state,agelow,agehigh,agencyid,agencyname
// examples:
//  Retrieve incident with ID 1: GET /api/incident?id=1
//  Retrieve incidents whose ID occurs between 1 and 100 inclusive: GET /api/incident?idlow=1&idhigh=100
//  Retrieve incidents with ID at most 10: GET /api/incident?idhigh=10
//  Retrieve incidents whose victim's name includes "Elliot": GET /api/incident?victimname=Elliot
//  Retrieve incidents that occurred in Wichita: GET /api/incident?city=Wichita
//  Retrieve incidents that occurred in Mason county: GET /api/incident?county=Mason
//  Retrieve incidents that occurred in California: GET /api/incident?state=CA
//  Retrieve incidents between ages 30 and 40 inclusive: GET /api/incident?agelow=30&agehigh=40
//  Retrieve incidents age at least 20 inclusive: GET /api/incident?agelow=20
//  Retrieve incidents where the agency with ID 3 was involved: GET /api/incident?agencyid=3
//  Retrieve incidents where the names of the agencies involved contained the text "Sheriff": GET /api/incident?agencyname=Sheriff
const getIncident = async (req, res) => {
  try {
    let { id, idlow, idhigh, victimname, city, county, state, agelow, agehigh, agencyid, agencyname } = req.query;
    const result = {};

    if (id) {
      if (isNaN(id)) throw new Error("Invalid Incident ID");
      id = Math.round(Number(id));
      result.content = await incident.findByID(id);
    }
    else if (idlow || idhigh) {
      if (idlow && isNaN(idlow) || idhigh && isNaN(idhigh)) throw new Error("Invalid Incident ID low, Incident ID high");
      idlow = idlow ? Math.floor(Number(idlow)) : 0;
      idhigh = idhigh ? Math.floor(Number(idhigh)) : 2147483647;
      result.content = await incident.findByRangeID(idlow, idhigh);
    }
    else if (victimname) {
      result.content = await incident.searchByVictimName(victimname);
    }
    else if (city) {
      result.content = await incident.searchByCityName(city);
    }
    else if (county) {
      result.content = await incident.searchByCounty(county);
    }
    else if (state) {
      result.content = await incident.searchByState(state);
    }
    else if (agelow || agehigh) {
      if (agelow && isNaN(agelow) || agehigh && isNaN(agehigh)) throw new Error("Invalid age low, age high");
      agelow = agelow ? Math.floor(Number(agelow)) : 0;
      agehigh = agehigh ? Math.floor(Number(agehigh)) : 2147483647;
      result.content = await incident.findByRangeAge(agelow, agehigh);
    }
    else if (agencyid) {
      if (isNaN(agencyid)) throw new Error("Invalid Agency ID");
      result.content = await incident.findByAgencyID(agencyid);
    }
    else if (agencyname) {
      result.content = await incident.searchByAgencyName(agencyname);
    }
    else {
      result.content = await incident.searchByVictimName("");
    }

    res.status(200).json(result.content);
  } catch (error){
    console.error('Error executing getIncident query', error);
    res.status(500).json({error: 'Internal server error'});
  }
};


// Set incident
// TODO -- need to consider how to handle ID creation


// Get from Victim
// route: GET /api/victim/:id,idlow,idhigh,name,agelow,agehigh,gender
// examples:
//  Retrieve victim with ID 1: GET /api/victim?id=1
//  Retrieve victims whose ID occurs between 1 and 100 inclusive: GET /api/victim?idlow=1&idhigh=100
//  Retrieve victims with ID at most 10: GET /api/victim?idhigh=10
//  Retrieve victims whose name includes "Elliot": GET /api/victim?name=Elliot
//  Retrieve victims between ages 30 and 40 inclusive: GET /api/victim?agelow=30&agehigh=40
//  Retrieve victims age at least 20 inclusive: GET /api/victim?agelow=20
//  Retrieve male victims: GET /api/victim?gender=male
const getVictim = async (req, res) => {
  try {
    const { id, idlow, idhigh, name, agelow, agehigh, gender } = req.query;

    if (id) {
      if (isNaN(id)) throw new Error('Invalid ID');
      id = Math.round(Number(id));
      result.content = await victim.findByID(id);
    }
    else if (idlow || idhigh) {
      if (idlow && isNaN(idlow) || idhigh && isNaN(idhigh)) throw new Error('Invalid ID low, ID high');
      idlow = idlow ? Math.floor(Number(idlow)) : 0;
      idhigh = idhigh ? Math.floor(Number(idhigh)) : 2147483647;
      result.content = await victim.findByRangeID(idlow, idhigh);
    }
    else if (name) {
      result.content = await victim.searchByName(name);
    }
    else if (agelow || agehigh) {
      if (agelow && isNaN(agelow) || agehigh && isNaN(agehigh)) throw new Error('Invalid age low, age high');
      agelow = agelow ? Math.floor(Number(agelow)) : 0;
      agehigh = agehigh ? Math.floor(Number(agehigh)) : 2147483647;
      result.content = await victim.findByRangeAge(agelow, agehigh);
    }
    else if (gender) {
      result.content = await victim.findByGender(gender);
    }
    else {
      result.content = await victim.searchByName("");
    }

    res.status(200).json(result.content);
  } catch (error){
    console.error('Error executing getVictim query', error);
    res.status(500).json({error: 'Internal server error'});
  }
};


// Get from Agency
// route: GET /api/agency/:id,idlow,idhigh,name,shootlow,shoothigh,state
// examples:
//  Retrieve agency with ID 1: GET /api/agency?id=1
//  Retrieve agencies whose ID occurs between 1 and 100 inclusive: GET /api/agency?idlow=1&idhigh=100
//  Retrieve agencies with ID at most 10: GET /api/agency?idhigh=10
//  Retrieve agencies whose name includes "Sheriff": GET /api/agency?name=Sheriff
//  Retrieve agencies with between 1 and 10 shootings inclusive: GET /api/agency?shootlow=1&shoothigh=10
//  Retrieve agencies with at least 5 shootings inclusive: GET /api/agency?shootlow=5
//  Retrieve agencies in California: GET /api/agency?state=CA
const getAgency = async (req, res) => {
  try {
    let { id, idlow, idhigh, name, shootlow, shoothigh, state } = req.query;
    const result = {};

    if (id) {
      if (isNaN(id)) throw new Error('Invalid ID');
      id = Math.round(Number(id));
      result.content = await agency.findByID(id);
    }
    else if (idlow || idhigh) {
      if (idlow && isNaN(idlow) || idhigh && isNaN(idhigh)) throw new Error('Invalid ID low, ID high');
      idlow = idlow ? Math.floor(Number(idlow)) : 0;
      idhigh = idhigh ? Math.floor(Number(idhigh)) : 2147483647;
      result.content = await agency.findByRangeID(idlow, idhigh);
    }
    else if (name) {
      result.content = await agency.searchByName(name);
    }
    else if (shootlow || shoothigh) {
      if (shootlow && isNaN(shootlow) || shoothigh && isNaN(shoothigh)) throw new Error('Invalid shoot low, shoot high');
      shootlow = shootlow ? Math.floor(Number(shootlow)) : 0;
      shoothigh = shoothigh ? Math.floor(Number(shoothigh)) : 2147483647;
      result.content = await agency.findByRangeTotalIncidents(shootlow, shoothigh);
    }
    else if (state) {
      result.content = await agency.searchByState(state);
    }
    else {
      result.content = await agency.searchByName("");
    }

    res.status(200).json(result.content);
  } catch (error){
    console.error('Error executing Agency GET', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

module.exports = {
  getIncident,
  getVictim,
  getAgency,
};
