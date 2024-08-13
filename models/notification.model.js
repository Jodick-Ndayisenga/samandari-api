const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    userId: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      default: [],
    },
    type: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
