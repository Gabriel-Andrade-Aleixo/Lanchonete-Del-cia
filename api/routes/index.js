const express = require('express');
const router = express.Router();
const controllerIndex = require('../controllers/indexControllers.js');

router.get('/', controllerIndex.getIndex);
// router.get('*', controllerIndex.indexNotFound);

module.exports = router