const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema for YouTube video link
const YouTubeLinkSchema = new Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false }
);

// Define schema for book in library
const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    // Add other fields related to books as needed
  },
  { _id: false }
);

// Define schema for online class
const OnlineClassSchema = new Schema(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goals: {
      type: String,
      required: true,
    },
    expectedOutcome: {
      type: String,
      required: true,
    },
    lessons: {
      type: [String],
      required: true,
      default: [],
    },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    views: { type: Number, default: 0 },
    whatTheyWillLearn: {
      type: [String],
      required: true,
      default: [],
    },
    necessity: { type: String, required: true },
    image:{
      type: String,
      required: false,
    },
    YouTubeLinks: { 
      type: [YouTubeLinkSchema] ,
    default: [],},
    booksInLibrary: { type: [BookSchema] ,
      default: [],
    },
    enrolledStudents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    approved: { 
      type: Boolean, 
      default: false 
    },
    startDate: { 
      type: Date ,
      default:Date.now
    },
    duration: { type: String,
      default: "2h 40min",
     },
    additionalInfo: { 
      type: String ,
      default: "",
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", OnlineClassSchema);

module.exports = Course;
