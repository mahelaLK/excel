const express = require('express');
const router = express.Router();
const { fetchVesselNames } = require('../controllers/vesselNameController.js');

router.get('/', fetchVesselNames);

module.exports = router;