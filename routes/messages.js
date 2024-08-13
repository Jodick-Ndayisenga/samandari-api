const express = require("express");
const protectRoute = require("../middleware/allProtectedRoute")

const {
  createMessage,
  getConvo,
  deleteMessage,
  updateMessageRead,
  updateMessageDelivered,
  getUnreadMessages,
  markMessagesAsRead

} = require("../controllers/messageController");

const router = express.Router();
router.post("/create-message",createMessage);
router.get("/get-messages/:convoId", getConvo);
router.get("/remove/:messageId", deleteMessage);
router.patch("/update-message/read/:messageId", updateMessageRead);
router.patch("/update-message/delivered/:messageId", updateMessageDelivered);
router.post('/mark-as-read', markMessagesAsRead);
router.get('/notifications/unread/:userId', getUnreadMessages);

module.exports = router;
