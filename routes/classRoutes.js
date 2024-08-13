const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

router.get('/get-pdfs', classController.getClassPdfs);

module.exports = router;
