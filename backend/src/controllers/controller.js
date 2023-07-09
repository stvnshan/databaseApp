const incident = require('../models/incident.js');
const victim = require('../models/victim.js');
const agency = require('../models/agency.js');
const city = require('../models/city.js');


// Get from Incident
// route: GET /api/incident
const getIncident = async (req, res) => {
  try {
    const { id, searchName } = req.query;
    if (id && !isNaN(id)) throw new Error('Invalid Incident query, invalid ID');

    const result = {};
    if (id) {
      const incidentID = parseInt(id);
      result.content = await incident.findByID(incidentID);
    } 
    res.status(200).json(result.content);
  } catch (error){
    console.error('Error executing getIncident query', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Get from Victim
// route: GET /api/victim
const getVictim = async (req, res) => {
  try {
    const { id, searchName } = req.query;
    if (id && !isNaN(id)) throw new Error('Invalid Victim query, invalid ID');

    const result = {};
    if (id) {
      const victimID = parseInt(id);
      result.content = await victim.findByID(victimID);
    }
    res.status(200).json(result.content);
  } catch (error){
    console.error('Error executing getVictim query', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

// Get from Agency
// route: GET /api/agency
const getAgency = async (req, res) => {
  try {
    const { id, searchName } = req.query
    if (id && !isNaN(id)) throw new Error('Invalid Agency query, invalid ID');;

    const result = {};
    if (id) result.content = await agency.findByID(id);
    else if (searchName) result.content = await agency.searchByName(searchName);
    else result.content = await agency.searchByName("");

    res.status(200).json(result.content);
  } catch (error){
    console.error('Error executing getAgency query', error);
    res.status(500).json({error: 'Internal server error'});
  }
};

module.exports = {
  getIncident,
  getVictim,
  getAgency
};
