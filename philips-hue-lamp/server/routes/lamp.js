const express = require('express');
const lampController = require('../controller/lampController');

const router = express.Router();

router.get("/", lampController.get_lamps);

router.post("/", lampController.add_lamp);

router.put("/:code", lampController.update_status);

router.put("/:code/blink", lampController.blink_lamp);

module.exports = router;