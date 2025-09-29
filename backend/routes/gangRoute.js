const express = require('express');
const router = express.Router();
const { fetchGang } = require('../controllers/gangController.js');

router.get('/:inwardVoyage', fetchGang);

module.exports = router;