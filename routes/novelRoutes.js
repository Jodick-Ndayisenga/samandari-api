const express = require('express');
const router = express.Router();
const novelController = require('../controllers/novelController');

router.get('/get-pdfs', novelController.getNovelPdfs);
router.get('/getAuthors', novelController.getAuthors);
router.get('/searchNovels', novelController.searchNovels);

module.exports = router;
