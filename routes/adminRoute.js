const express = require('express');
const {verifyAdmin} = require('../middleware/allProtectedRoute');
const adminController = require('../controllers/adminController');
const rateLimiter = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/login-admin',rateLimiter, adminController.getAdminUserByEmail)
router.get("/get-db-info/:userId", verifyAdmin, adminController.getDbInfo)


module.exports = router