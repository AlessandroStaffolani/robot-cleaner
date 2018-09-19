const express = require('express');
const mapController = require('../controller/mapController');
const router = express.Router();

router.get('/', mapController.get_current_map);

router.post('/', mapController.save_map);

module.exports = router;