const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const loginController = require('../controllers/loginController');
const updadateUserImage = require('../controllers/userUpadates');
const rateLimiter = require('../middleware/rateLimiter'); 
const { protectRoute, verifyTokenAndSession } = require('../middleware/allProtectedRoute');
const {setCookie} = require('../middleware/auth')
router.post("/verify-token", verifyTokenAndSession);
//router.post("/set-cookie", setCookie);
router.post('/login',rateLimiter, loginController.getUserByEmail);
router.get('/user-details/:id', loginController.getUserDetails);
router.get('/logout/:userId', loginController.logoutUser);
router.get('/unread-notifications/:userId', loginController.getUnreadNotifications);
router.get('/fetch-notifications/:userId', loginController.fetchNotifications);
router.post('/notifications/mark-as-read', loginController.markNotificationsAsRead);
router.put('/update/profile/:type/:userId/:field', updadateUserImage.updateUserProfilePicture );
router.put('/update/personal-statement/:id', updadateUserImage.updateUserStatement );
router.put('/update/about-statement/:id', updadateUserImage.updateUserAbout );
router.put('/update/add-experience/:userId/:work', updadateUserImage.addExperience );
router.put('/update/add-education/:userId/:work', updadateUserImage.addEducation );
router.put('/add-skill/:id', updadateUserImage.addNewSkill);
router.post('/follow-unfollow', updadateUserImage.followUnfollow);
router.get('/get-users/:startIndex/:limit', updadateUserImage.getUsers );
router.get('/get-users-to-follow/:userId', loginController.getUsersToFollow);
router.post('/register', registerController.registerUser);
router.post('/change-password', registerController.changePassword);
router.get('/forgot-password/:email', registerController.getEmailForPasswordForgotten);
router.post('/confirm-email', registerController.confirmEmail);
router.get('/find/:userId', loginController.getUserById); 
router.get('/findall', loginController.getUsers); 
router.get('/get-users-to-share-post/:userId', loginController.getUserToShare)

module.exports = router;
