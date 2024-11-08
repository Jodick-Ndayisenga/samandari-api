const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const updadateUserImage = require('../controllers/userUpadates');
const rateLimiter = require('../middleware/rateLimiter'); 
const {  verifyTokenAndSession } = require('../middleware/allProtectedRoute');

router.post("/verify-token", verifyTokenAndSession);
router.post('/login',rateLimiter, loginController.getUserByEmail);
router.get('/user-details/:id', loginController.getUserDetails);
router.get('/logout/:userId', loginController.logoutUser);
router.get('/unread-notifications/:userId', loginController.getUnreadNotifications);
router.get('/fetch-notifications/:userId', loginController.fetchNotifications);
router.post('/notifications/mark-as-read', loginController.markNotificationsAsRead);
router.put('/update/profile/:type/:userId/:field', updadateUserImage.updateUserProfilePicture );
router.post('/follow-unfollow', updadateUserImage.followUnfollow);
router.get('/get-users-to-follow/:userId', loginController.getUsersToFollow);
router.post('/register', registerController.registerUser);
router.post('/change-password', registerController.changePassword);
router.get('/forgot-password/:email', registerController.getEmailForPasswordForgotten);
router.post('/confirm-email', registerController.confirmEmail);

module.exports = router;
