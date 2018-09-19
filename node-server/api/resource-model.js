const express = require('express');
const resourceModelController = require('../controller/resourceModelController');
const router = express.Router();

router.get('/', resourceModelController.get_resource_model);

module.exports = router;