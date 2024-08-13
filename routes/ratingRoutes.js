const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/novels/:id/rate', ratingController.addRating);
router.get('/novels/:id/rating', ratingController.getRating);

module.exports = router;
