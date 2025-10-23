const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// Import controllers
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  toggleBlogLike,
  checkBlogLike,
} = require("../controllers/blogController");

const {
  addComment,
  getBlogComments,
  updateComment,
  deleteComment,
  toggleCommentLike,
  checkCommentLike,
} = require("../controllers/commentController");

const {
  generateAIBlog,
  generateBlogImage,
} = require("../controllers/aiController");

const authUser = require("../middleware/user.auth");

// Blog routes
router.post("/api/blogs/create", authUser, createBlog);
router.get("/api/blogs", getAllBlogs);
router.get("/api/blogs/:id", getBlogById);
router.patch("/api/blogs/:id", authUser, updateBlog);
router.delete("/api/blogs/:id", authUser, deleteBlog);
router.post("/api/blogs/upload-image", authUser, upload.single("image"), uploadBlogImage);
router.post("/api/blogs/:id/like", authUser, toggleBlogLike);
router.get("/api/blogs/:id/like-status", authUser, checkBlogLike);

// Comment routes
router.post("/api/blogs/:blogId/comment", authUser, addComment);
router.get("/api/blogs/:blogId/comments", getBlogComments);
router.patch("/api/comments/:commentId", authUser, updateComment);
router.delete("/api/comments/:commentId", authUser, deleteComment);
router.post("/api/comments/:commentId/like", authUser, toggleCommentLike);
router.get("/api/comments/:commentId/like-status", authUser, checkCommentLike);

// AI routes
router.post("/api/blogs/ai-generate", authUser, generateAIBlog);
router.post("/api/blogs/generate-image", authUser, generateBlogImage);

module.exports = router;
