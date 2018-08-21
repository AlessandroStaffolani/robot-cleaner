const express = require('express');
const lampController = require('../controller/lampController');

const router = express.Router();

router.get("/", lampController.get_lamps);

router.post("/", lampController.add_lamp);

router.put("/:id", lampController.update_status);

router.put("/:id/blink", lampController.blink_lamp);

module.exports = router;