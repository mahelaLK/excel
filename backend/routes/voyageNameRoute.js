const express = require('express');
const router = express.Router();
const { fetchVoyageNames } = require('../controllers/voyageNameController.js');

router.get('/', fetchVoyageNames);

module.exports = router;