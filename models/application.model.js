const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema({
  applicantId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref:"User",
  },
  github: {
    type: String,
    required: false,
  },
  linkedIn: {
    type: String,
    required: [true, "LinkedIn link is required"],
  },
  experience: {
    type: String,
    required: [true, "Experience is required"],
  },
  motivation: {
    type: String,
    required: [true, "motivation is required"],
  },
  read:{
    type: Boolean,
    required: true,
    default: false,
  }
  ,
  approved:{
    type: Boolean,
    required: true,
    default: false,
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
