const express = require('express');
const weatherController = require('../controller/weatherController');
const router = express.Router();

router.get('/temperature/:city', weatherController.get_city_temperature);

module.exports = router;