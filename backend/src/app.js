const express = require('express');
const cors = require('cors');
const {
  selectAllVictimIDs,
  selectAllAgencyIDs,
  selectAllIncidentIDs,
  selectVictimByID,
  selectIncidentByID,
  selectAgencyByName
} = require('./db/dbQuery');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/allincidents', async (req, res) => {
  try {
  const result = await selectAllIncidentIDs();
  res.json(result);
  } catch (error){
  console.error('Error executing selectAllIncidentIDs query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/api/allagencies', async (req, res) => {
  try {
  const result = await selectAllAgencyIDs();
  res.json(result);
  } catch (error){
  console.error('Error executing selectAllAgencyIDs query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/api/allvictims', async (req, res) => {
  try {
  const result = await selectAllVictimIDs();
  res.json(result);
  } catch (error){
  console.error('Error executing selectAllVictimIDs query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/api/incident', async (req, res) => {
  try {
  const { search } = req.query;
  if (!search || !isNaN(req.query.id)) {
    throw new Error('Invalid Incident query');
  }
  const incidentID = parseInt(req.query.id);
  const result = await selectIncidentByID(incidentID);
  res.json(result);
  } catch (error){
  console.error('Error executing selectIncidentByID query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/api/victim', async (req, res) => {
  try {
  const { search } = req.query;
  if (!search || !isNaN(req.query.id)) {
    throw new Error('Invalid Victim query');
  }
  const victimID = parseInt(req.query.id);
  const result = await selectVictimByID(victimID);
  res.json(result);
  } catch (error){
  console.error('Error executing selectVictimByID query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.get('/api/agency', async (req, res) => {
  try {
  const { search } = req.query;
  const agencyName = req.query.search;
  const result = await selectAgencyByName(agencyName);
  res.json(result);
  } catch (error){
  console.error('Error executing selectAgencyByName query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
