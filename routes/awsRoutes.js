const express = require('express');
const router = express.Router();
const awsController = require('../controllers/awsController');

router.post('/upload/:typeOfResource', awsController.uploadFile, awsController.uploadResource);
router.get('/list', awsController.listFiles);
router.get('/download/:filename', awsController.downloadFile);
router.delete('/delete/:filename', awsController.deleteFile);

module.exports = router;
