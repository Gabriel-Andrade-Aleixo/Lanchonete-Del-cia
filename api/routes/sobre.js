const express = require('express');
const router = express.Router();
const sobreController = require('../controllers/sobreController.js');

router.get('/', sobreController.getSobre);

module.exports = router;
