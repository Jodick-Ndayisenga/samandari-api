const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();
router.post("/create-course", courseController.createCourse)
router.get("/get-courses/:userId", courseController.getCourses)
router.get("/find-course/:id", courseController.findCourse)
router.get("/find-course-suggestions", courseController.findCourseSuggestions)

module.exports = router