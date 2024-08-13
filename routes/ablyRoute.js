const express = require('express');
const ablyConnection = require('../controllers/ablyController');
const router = express.Router();
router.get("/ably", ablyConnection.ablyUserConnection);

module.exports = router;