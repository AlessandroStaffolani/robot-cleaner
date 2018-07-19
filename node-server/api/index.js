/**
 *Module dependencies
 */

const express = require('express');
const indexController = require('../controller/indexController');

//==============================================================================

/**
 *Create router instance
 */

const router = express.Router();

//==============================================================================

/**
 *Routes
 */

router.get("/", indexController.index);

router.get("/angelo", indexController.angelo);

module.exports = router;