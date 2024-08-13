const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  convoId: String,
  originId: String,
  text: String,
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false }
},{ timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
