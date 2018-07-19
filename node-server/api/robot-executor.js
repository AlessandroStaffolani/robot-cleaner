/**
 *Module dependencies
 */

const express = require('express');
const robotExecutorController = require('../controller/robotExecutorController');

//==============================================================================

/**
 *Create router instance
 */

const router = express.Router();

//==============================================================================

/**
 *Routes
 */

router.get("/command/:cmd", robotExecutorController.command);

module.exports = router;