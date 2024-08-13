const mongoose = require('mongoose');

const replySchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  nature:{
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

const commentSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  nature:{
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  replies: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Reply',
    default: [],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref : "User",
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref : "User",
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  dislikes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  },
  sharedWith: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  reposted: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  }
},{ timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
const Post = mongoose.model('Post', postSchema);
const Reply = mongoose.model('Reply', replySchema);

module.exports = { Comment, Post, Reply };
