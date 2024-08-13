const conversation = require("../models/conversation.model");
const mongoose = require("mongoose");

const createchat = async (req, res) => {
  const { userID1, userID2 } = req.body;
  if (userID1 && userID2) {
    try {
      const chat = await conversation.findOne({
        participants: { $all: [userID1, userID2] },
      });
      if (chat)
        return res
          .status(200)
          .json({ success: true, message: "chat already exists" });
      const newChat = await conversation.create({
        participants: [userID1, userID2],
      });
      res.status(200).json({ chat: newChat, success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
};

const getUserChats = async (req, res) => {
  const id = req.params.userId;
  const Ids = req.query.fetchedChatsIds;
  let fetchedChatIds = Ids ? Ids.split(",") : [];
  try {
    const chats = await conversation
      .find({
        participants: { $in: [id] }, /// find out if the user is in the list we are intereted
        _id: {
          $nin: fetchedChatIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      })
      .sort({ updatedAt: -1 })
      .limit(7)
      .populate({
        path: "lastMessage",
        select: "text timestamp",
      })
      .populate({
        path: "participants",
        select: "firstName lastName username _id profileUrl", // Specify the fields you want to fetch from the user model
      });
    const filteredChats = chats.map((chat) => {
      const otherParticipants = chat.participants.filter(
        (participant) => participant._id.toString() !== id
      );
      return {
        ...chat.toObject(),
        participants: otherParticipants,
      };
    });

    res.status(200).json({ chats: filteredChats });
  } catch (error) {
    console.log(error);
    res.status(500).json(error, "the fuck is here");
  }
};

const findConversation = async (req, res) => {
  const { userID1, userID2 } = req.params; // fetch all the user_ids in the chat we are interested

  try {
    const chat = await conversation.findOne({
      participants: { $all: [userID1, userID2] },
    });

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  res.status(200).json({ answer: "we did not find the users" });
};

const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await conversation
      .find({ participants: userId })
      .select("_id")
      .exec();
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createchat,
  getUserChats,
  findConversation,
  getConversations,
};
