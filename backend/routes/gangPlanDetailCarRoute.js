const express = require('express');
const router = express.Router();
const { fetchGangCar } = require('../controllers/gangPlanDetailCarController.js');

router.get('/:inwardVoyage', fetchGangCar);

module.exports = router;