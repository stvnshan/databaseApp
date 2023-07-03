const express = require('express');
const router = express.Router();
const {
    getIncident,
    getVictim,
    getAgency
} = require('../controllers/controller');

// Routes
router.route('/incident').get(getIncident);
router.route('/victim').get(getVictim);
router.route('/agency').get(getAgency);

module.exports = router;
