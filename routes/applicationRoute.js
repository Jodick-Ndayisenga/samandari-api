const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post("/apply-instructor", applicationController.instructorApplication);
router.get("/get-applications", applicationController.getApps)
router.post("/review-application", applicationController.reviewApplication)
module.exports = router