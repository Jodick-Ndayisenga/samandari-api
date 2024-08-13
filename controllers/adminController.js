const User = require("../models/user.model");
const {Post} = require("../models/post.model");
const Application = require("../models/application.model");
const Course = require("../models/course.model");
const {Comment} = require("../models/post.model");
const {Reply} = require("../models/post.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.getDbInfo = async (req, res) => {
    let allUsers = await User.countDocuments();
    const allPosts = await Post.countDocuments();
    const allApplications = await Application.countDocuments();
    const allCourses = await Course.countDocuments();
    const allComments = await Comment.countDocuments();
    const allReplies = await Reply.countDocuments();
    res.json({allUsers, allPosts, allApplications, allCourses, allComments, allReplies});
}

exports.getAdminUserByEmail = async (req, res) => {
    const { password } = req.body;
    try {
      const user = req.user;
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          if (user.isAdmin) {
            res.status(200).json({ user });
          } else {
            res.status(400).json({ admin: "Not Admin" });
          }
        } else {
          res.status(400).json({ password: "Invalid password" });
        }
      } else {
        res.status(400).json({ email: "Email does not exist" }); // More generic error message
      }
    } catch (err) {
      res.status(500).json({ error: err.message }); // Use "error" for consistency
    }
  };