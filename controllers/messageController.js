const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");


// const createMessage = async (req, res) => {
//   const newMessage = req.body.convoId;
//   const convoId = newMessage.convoId;
//   try {
//     const conversation = await Conversation.findById(convoId);

//     if (conversation) {
//       const message = await Message.create(newMessage);
//       conversation.lastMessage = message._id;
//       await conversation.save();
//       //const result = await Conversation.updateMany({}, { $set: { unreadCount: 0 } });
//       //const results = await Message.updateMany({ read: { $exists: true } }, { $set: { read: true } });
//       res.status(200).json({ message });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json(error);
//   }
// };

const createMessage = async (req, res) => {
  try {
      const message = req.body.message;
      const convoId = message.convoId;
      const newMessage = await Message.create(message)

      await Conversation.findByIdAndUpdate(convoId, {
          lastMessage: newMessage._id
      });
      
      res.status(201).json({message:newMessage});
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const getConvo = async (req, res) => {
  const { convoId } = req.params;

  try {
    const messages = await Message.find({ convoId })
      .sort({ _id: -1 })
      .populate("originId", "firstName lastName username _id profileUrl")
      .limit(8)
      .exec();
    if (messages.length > 0) {
      res.status(200).json({ messages: messages.reverse() });
    } else {
      res.status(200).json({ messages: [] });
    }
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateMessageDelivered = async (req, res) => {
  const { messageId } = req.params;
  const { delivered, read } = req.body;

  try {
    const message = Message.findByIdAndUpdate(
      messageId,
      { delivered },
      { new: true }
    );
    res.status(200).json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).send("Internal server error");
  }
};

const updateMessageRead = async (req, res) => {
  const { messageId } = req.params;
  const { read } = req.body;

  try {
    const message = Message.findByIdAndUpdate(
      messageId,
      { read },
      { new: true }
    );
    res.status(200).json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    res.status(500).send("Internal server error");
  }
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const deletedMessage = await Message.deleteOne({ _id: messageId });

    if (!deletedMessage.deletedCount) {
      return res.status(404).send("Message not found");
    }
    res.status(200).send("Message deleted successfully");
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).send("Internal server error");
  }
};
const markMessagesAsRead = async (req, res) => {
  try {
    const { convoId, userId } = req.body;

    // Update messages where the originId is not the userId to read: true
    await Message.updateMany(
      { convoId: convoId, originId: { $ne: userId }, read: false },
      { $set: { read: true, delivered: true } }
    );

    res.status(200).json({success:true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUnreadMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ participants: { $in: [userId] } });

    // Create an array to hold all unread messages
    let allUnreadMessages = [];

    // Loop through each conversation and find unread messages
    for (let convo of conversations) {
      const unreadMessages = await Message.find({
        convoId: convo._id,
        originId: { $ne: userId },
        read: false
      })
      .exec();

      // Combine the messages into the allUnreadMessages array
      allUnreadMessages = allUnreadMessages.concat(unreadMessages);
    }

    res.status(200).json(allUnreadMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createMessage,
  getConvo,
  deleteMessage,
  updateMessageDelivered,
  updateMessageRead,
  markMessagesAsRead,
  getUnreadMessages,
};
