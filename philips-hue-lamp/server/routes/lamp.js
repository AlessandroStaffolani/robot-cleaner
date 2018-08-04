const express = require('express');
const lampController = require('../controller/lampController');

const router = express.Router();

router.post("/", lampController.add_lamp);

router.put("/:id", lampController.update_status);

module.exports = router;