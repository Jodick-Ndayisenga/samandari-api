const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
//const {protectRoute} = require("../middleware/allProtectedRoute");

router.post("/create-post/:theUserId/:fileStatus", postController.createPost);
router.post("/comment", postController.commentPost);
router.get("/get-posts/:userId/:page", postController.getPosts);
router.get("/get-comments/:postId/:startIndex/:limit", postController.getComments);
router.put("/:postId/like", postController.likePost);
router.put("/:postId/dislike", postController.dislikePost);
router.put("/comments/dislike/:commentId/:userId", postController.dislikeComment);
router.put("/comments/like/:commentId/:userId", postController.likeComment);
router.delete("/delete-post/:postId", postController.deletePost);
router.post("/comment-reply", postController.replyComment);
router.get("/comment/get-replies/:commentId/:startIndex/:limit", postController.getCommentReplies);
router.post("/comment-reply/like", postController.likeReply);
router.post("/comment-reply/dislike", postController.dislikeReply);
router.put("/share-with/:userId/:postId", postController.sharePostWithUsers);
router.put("/repost/:userId/:postId", postController.repostPost);

module.exports = router;
//