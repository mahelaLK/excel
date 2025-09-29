const express = require('express');
const router = express.Router();
const { fetchGangPlanDetail } = require('../controllers/gangPlanDetailController.js');

router.get('/:inwardVoyage', fetchGangPlanDetail);

module.exports = router;
