const { Post } = require("../models/post.model");
const { Comment } = require("../models/post.model");
const { Reply } = require("../models/post.model");
const User = require("../models/user.model");
const Notification = require("../models/notification.model");
const uploadFile = require("./postFileUpload");
const multer = require("multer");
const upload = multer().single("file");
const mongoose = require("mongoose");

const normalizeString = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
};

exports.createPost = async (req, res) => {
  const { theUserId, fileStatus } = req.params;
  try {
    upload(req, res, async function (err) {
      if (fileStatus === "true") {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          return res.status(500).json({ success: false, message: err.message });
        } else if (err) {
          // An unknown error occurred when uploading
          return res.status(500).json({ success: false, message: err.message });
        }

        const file = req.file;
        const isImage = file.mimetype.startsWith("image/");
        const folder = isImage
          ? "Samandari/postMedia/images"
          : "Samandari/postMedia/videos";
        const fileName = `${req.params.userId}_${Date.now()}`;
        const fileUrl = await uploadFile(file.buffer, folder, fileName);
        const data = {
          userId: theUserId,
          content: req.body.content,
          file: fileUrl,
        };

        const newPost = await Post.create(data);
        if (newPost) {
          const updatedPost = await Post.findById(newPost._id).populate(
            "userId",
            "firstName lastName profileUrl origin _id"
          );
          res.status(200).json({ success: true, post: updatedPost });
        }
      } else {
        const data = {
          userId: theUserId,
          content: req.body.content,
        };
        const newPost = await Post.create(data);
        if (newPost) {
          const updatedPost = await Post.findById(newPost._id).populate(
            "userId",
            "firstName lastName profileUrl origin _id"
          );
          res.status(200).json({ success: true, post: updatedPost });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId;

    const post = await Post.findById(postId)
      .populate("userId", "_id firstName lastName profileUrl origin") // Adjust the fields to populate from the User model
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileUrl origin", // Adjust the fields to populate from the User model for comments
        },
      })
      .exec();

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      res.status(200).json({ success: true, post});
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
      await post.save();
      const notification = await Notification.create({
        source: userId,
        userId: post.userId._id,
        targetId: post._id,
        type: "likePost",
      })
      await notification.save();
      res.status(200).json({ success: true, post, notification });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId;

    const post = await Post.findById(postId)
      .populate("userId", "firstName lastName profileUrl origin") // Adjust the fields to populate from the User model
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName profileUrl origin", // Adjust the fields to populate from the User model for comments
        },
      })
      .exec();

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
      await post.save();
      res.status(200).json({ success: true, post });
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      const notification = await Notification.create({
        source: userId,
        userId: post.userId._id,
        targetId: post._id,
        type: "dislikePost",
      })
      await notification.save();
      res.status(200).json({ success: true, post, notification });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.commentPost = async (req, res) => {
  const data = req.body;
  const { postId } = req.body;

  try {
    // Find the post to ensure it exists and then add the comment
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    // Create the new comment
    const comment = await Comment.create(data);
    post.comments.push(comment._id);
    await post.save();
    const updatedComment = await Comment.findById(comment._id)
      .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
      .exec();
    
      const notification = await Notification.create({
        source: updatedComment.userId._id, 
        userId: post.userId,
        targetId: post._id,
        type: "commentPost",
      })
      await notification.save();
    res.status(200).json({ success: true, comment: updatedComment, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { postId, startIndex, limit } = req.params;
  try {
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(parseInt(startIndex))
      .limit(parseInt(limit))
      .populate("userId", "firstName lastName profileUrl origin") // Adjust the fields to populate from the User model
      .select("content likes dislikes userId nature createdAt _id replies") // Adjust the fields to populate from the Comment model
      .exec();
    res.status(200).json({ success: true, comments: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { commentId, userId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      await comment.save();
      const updatedComment = await Comment.findById(comment._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();
      res.status(200).json({ success: true, comment: updatedComment });
    } else {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
      await comment.save();
      const updatedComment = await Comment.findById(comment._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();

        const notification = await Notification.create({
          source: userId,
          userId: updatedComment.userId,
          targetId: updatedComment.postId,
          type: "likeComment",
        })
      res.status(200).json({ success: true, comment: updatedComment, notification });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dislikeComment = async (req, res) => {
  try {
    const { commentId, userId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId
      );
      await comment.save();
      const updatedComment = await Comment.findById(comment._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();
      res.status(200).json({ success: true, comment: updatedComment });
    } else {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      await comment.save();
      const updatedComment = await Comment.findById(comment._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();

        const notification = await Notification.create({
          source: userId,
          userId: updatedComment.userId,
          targetId: updatedComment.postId,
          type: "dislikeComment",
        })
      res.status(200).json({ success: true, comment: updatedComment , notification});
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    } else {
      const comments = await Comment.find({ postId });
      const commentIds = comments.map((comment) => comment._id);
      await Reply.deleteMany({ commentId: { $in: commentIds } });
      await Comment.deleteMany({ postId });
      await Post.deleteOne({ _id: postId });
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "firstName lastName profileUrl origin") // Adjust the fields to populate from the User model
        .populate({
          path: "comments",
          select: "content likes dislikes userId nature createdAt _id", // Adjust the fields to populate from the Comment model
        })
        .exec();
      res.status(200).json({ success: true, posts: posts });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyComment = async (req, res) => {
  const { data } = req.body;
  const commentId = data.commentId;

  try {
    const myComment = await Comment.findById(commentId);
    if (!myComment) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    const reply = await Reply.create(data);
    myComment.replies.push(reply._id);
    await myComment.save();
    const updatedComment = await Comment.findById(myComment._id)
      .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
      .select("content likes dislikes userId nature createdAt _id replies")
      .exec();

    const updatedReply = await Reply.findById(reply._id)
      .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
      .select("content likes dislikes userId nature createdAt")
      .exec();

      const notification = await Notification.create({
        source: data.userId,
        userId: myComment.userId,
        targetId: myComment.postId,
        type: "replyComment",
      })
    res
      .status(200)
      .json({ success: true, comment: updatedComment, reply: updatedReply, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentReplies = async (req, res) => {
  const { commentId, startIndex, limit } = req.params;
  try {
    const replies = await Reply.find({ commentId })
      .sort({ createdAt: -1 })
      .skip(parseInt(startIndex))
      .limit(parseInt(limit))
      .populate("userId", "firstName lastName profileUrl origin") // Adjust the fields to populate from the User model
      .select("content likes dislikes userId nature createdAt _id") // Adjust the fields to populate from the Comment model
      .exec();
    res.status(200).json({ success: true, replies: replies.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeReply = async (req, res) => {
  try {
    const { ReplyId, userId } = req.body;
    const reply = await Reply.findById(ReplyId);
    if (!reply) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (reply.likes.includes(userId)) {
      reply.likes = reply.likes.filter((id) => id.toString() !== userId);
      await reply.save();
      const updatedReply = await Reply.findById(reply._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();
      res.status(200).json({ success: true, reply: updatedReply });
    } else {
      reply.likes.push(userId);
      reply.dislikes = reply.dislikes.filter((id) => id.toString() !== userId);
      await reply.save();
      const updatedReply = await Reply.findById(reply._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();

        const notification = await Notification.create({
          source: userId,
          userId: reply.userId,
          targetId: reply.commentId,
          type: "likeReply",
        })
      res.status(200).json({ success: true, reply: updatedReply, notification });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dislikeReply = async (req, res) => {
  try {
    const { ReplyId, userId } = req.body;
    const reply = await Reply.findById(ReplyId);
    if (!reply) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (reply.dislikes.includes(userId)) {
      reply.dislikes = reply.dislikes.filter((id) => id.toString() !== userId);
      await reply.save();
      const updatedReply = await Reply.findById(reply._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();
      res.status(200).json({ success: true, reply: updatedReply });
    } else {
      reply.dislikes.push(userId);
      reply.likes = reply.likes.filter((id) => id.toString() !== userId);
      await reply.save();
      const updatedReply = await Reply.findById(reply._id)
        .populate("userId", "firstName lastName profileUrl origin _id") // Adjust the fields to populate from the User model
        .exec();

        const notification = await Notification.create({
          source: userId,
          userId: reply.userId,
          targetId: reply.commentId,
          type: "dislikeReply",
        })
      res.status(200).json({ success: true, reply: updatedReply, notification });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    let {userId, page } = req.params;
    
    const Ids = req.query.fetchedPostIds;
    let fetchedPostIds = Ids ? Ids.split(",") : [];
    page = parseInt(page);
    const limit = 2;
    const skip = (page - 1) * limit;
    let posts = [];

    // const updateResult = await Post.updateMany(
    //   { sharedWith: { $exists: false } }, // Condition to match documents without reposted field
    //   { $set: { sharedWith: [] } }       // Update to add reposted field with default value
    // );

    // console.log(`Updated ${updateResult.nModified} documents`);

    
    const fetchAndPopulatePosts = async (query, limit, skip) => {
      const gottenPosts = await Post.find({
        ...query,
        _id: {
          $nin: fetchedPostIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstName lastName profileUrl origin _id");
      const newFetchedIds = gottenPosts.map((post) => post._id.toString());
      fetchedPostIds.push(...newFetchedIds);
      return gottenPosts;
    };

    // Fetch posts shared with the current user
    posts = await fetchAndPopulatePosts(
      { sharedWith: { $in: [new mongoose.Types.ObjectId(userId)] } },
      limit,
      skip
    );

    if (posts.length < limit) {
      const remainingLimit = limit - posts.length;
      // Fetch posts from users the current user is following
      const user = await User.findById(userId).populate("following", "_id");
      const followingIds = user.following.map((follow) => follow._id);
      const followingPosts = await fetchAndPopulatePosts(
        { userId: { $in: followingIds } },
        remainingLimit,
        skip
      );
      posts = posts.concat(followingPosts);
    }

    if (posts.length < limit) {
      const remainingLimit = limit - posts.length;
      // Fetch posts from users who follow the current user
      const followers = await User.find({
        following: { $in: [new mongoose.Types.ObjectId(userId)] },
      }).select("_id");
      const followerIds = followers.map((follower) => follower._id);
      const followerPosts = await fetchAndPopulatePosts(
        { userId: { $in: followerIds } },
        remainingLimit,
        skip
      );
      posts = posts.concat(followerPosts);
    }

    // STARTING ORIGIN AND SCHOOL FETCHING
    if (posts.length < limit) {
      const remainingLimit = limit - posts.length;
      const user = await User.findById(userId);
      const normalizedOrigin = normalizeString(user.origin);
      const normalizedSchool = normalizeString(user.school);

      // Use aggregation to normalize and match users
      const sameOriginOrSchoolUsers = await User.aggregate([
        {
          $addFields: {
            normalizedOrigin: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: { $toLower: "$origin" },
                        find: " ",
                        replacement: "",
                      },
                    },
                    find: "-",
                    replacement: "",
                  },
                },
                find: ",",
                replacement: "",
              },
            },
            normalizedSchool: {
              $replaceAll: {
                input: {
                  $replaceAll: {
                    input: {
                      $replaceAll: {
                        input: { $toLower: "$school" },
                        find: " ",
                        replacement: "",
                      },
                    },
                    find: "-",
                    replacement: "",
                  },
                },
                find: ",",
                replacement: "",
              },
            },
          },
        },
        {
          $match: {
            $or: [
              { normalizedOrigin: normalizedOrigin },
              { normalizedSchool: normalizedSchool },
            ],
          },
        },
        {
          $project: { _id: 1 },
        },
      ]);

      const sameOriginOrSchoolUserIds = sameOriginOrSchoolUsers.map(
        (user) => user._id
      );

      const originSchoolPosts = await fetchAndPopulatePosts(
        { userId: { $in: sameOriginOrSchoolUserIds } },
        remainingLimit,
        skip
      );
      posts = posts.concat(originSchoolPosts);
    }
    // ENDING ORIGIN AND SCHOOL FETCHING

    if (posts.length < limit) {
      const remainingLimit = limit - posts.length;
      posts = posts.concat(
        await fetchAndPopulatePosts(
          { userId: new mongoose.Types.ObjectId(userId) },
          remainingLimit,
          skip
        )
      );
    }

    const uniquePosts = Array.from(
      new Set(posts.map((post) => post._id.toString()))
    ).map((id) => {
      return posts.find((post) => post._id.toString() === id);
    });

    if (uniquePosts.length < limit) {
      const remainingLimit = limit - uniquePosts.length;
      const randomPosts = await Post.aggregate([
        {
          $match: {
            _id: {
              $nin: fetchedPostIds.map((id) => new mongoose.Types.ObjectId(id)),
            },
          },
        },
        { $sample: { size: remainingLimit } },
      ])
        .exec()
        .then((posts) =>
          Post.populate(posts, {
            path: "userId",
            select: "firstName lastName profileUrl origin _id",
          })
        );
      uniquePosts.push(...randomPosts);
    }
    res.status(200).json({ posts: uniquePosts });
  } catch (e) {
    console.error(e);
  }
};


exports.repostPost = async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const post = await Post.findById(postId)
    .populate("userId", "firstName lastName profileUrl origin _id")
    .exec();

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (!post.reposted.includes(userId)) {
      post.reposted.push(new mongoose.Types.ObjectId(userId));
      await post.save();
      res.status(200).json({ post});
    }
    const notification = await Notification.create({
      source: userId,
      userId: post.userId,
      targetId: post._id,
      type: "repost",
    })
    res.status(200).json({ post, notification });
  } catch (error) {
    console.error("Error reposting post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while reposting the post." });
  }
};

exports.sharePostWithUsers = async (req, res) => {
  const { userId, postId } = req.params;
  const { params } = req.body;
  let userIdsToShareWith = params.userIdsToShareWith
    ? params.userIdsToShareWith.split(",")
    : [];
  if (!Array.isArray(userIdsToShareWith) || userIdsToShareWith.length === 0) {
    return res
      .status(400)
      .json({ error: "userIdsToShareWith must be a non-empty array." });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only share your own posts." });
    }

    post.sharedWith = [
      ...new Set([
        ...post.sharedWith,
        ...userIdsToShareWith.map((id) => new mongoose.Types.ObjectId(id)),
      ]),
    ];
    await post.save();
    const newPost = await Post.findById(post._id)
      .populate("userId", "firstName lastName profileUrl origin _id")
      .exec();

      let allNotifications = [];
      userIdsToShareWith.forEach(id => {
        const notification = Notification.create({
          source: id,
          userId: post.userId,
          targetId: post._id,
          type: "share",
        })
        allNotifications.push(notification)
      })

    res.status(200).json({ post: newPost, notifications: allNotifications });
  } catch (error) {
    console.error("Error sharing post:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sharing the post." });
  }
};
