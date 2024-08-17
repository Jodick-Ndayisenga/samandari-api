const express = require('express');
const ablyConnection = require('../utils/ablyController');
const router = express.Router();

router.get("/ably", ablyConnection.ablyUserConnection);
module.exports = router;