const express = require ('express'); 
const { createchat, getUserChats, findConversation, getConversations } = require('../controllers/conversationController');
const router = express.Router(); 
router.post("/create-chat", createchat); 
router.get("/conversations/:userId", getConversations); 
router.get("/:userId", getUserChats); 
router.get("/find/:userID1/:userID2", findConversation); 
module.exports = router; 