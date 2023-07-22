const express = require('express');
const router = express.Router();
const {
    getIncident,
    getIncidentBrief,
    setIncident,
    getVictim,
    getAgency,
    getAgencyBrief,
} = require('../controllers/controller');

// Routes
router.route('/incident').get(getIncident).post(setIncident);
router.route('/incidentbrief').get(getIncidentBrief);
router.route('/victim').get(getVictim);
router.route('/agency').get(getAgency);
router.route('/agencybrief').get(getAgencyBrief);

module.exports = router;
