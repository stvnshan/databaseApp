const express = require('express');
const {
  selectAllVictimIDs,
  selectAllAgencyIDs,
  selectAllIncidentIDs,
  selectVictimByID,
  selectAgencyByID,
  selectIncidentByID
} = require('./db/dbQuery');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5001;

const app = express();
app.use(express.json());

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
  if (!search || !isNaN(req.query.id)) {
    throw new Error('Invalid Agency query');
  }
  const agencyID = parseInt(req.query.id);
  const result = await selectAgencyByID(agencyID);
  res.json(result);
  } catch (error){
  console.error('Error executing selectAgencyByID query', error);
  res.status(500).json({error: 'Internal server error'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
