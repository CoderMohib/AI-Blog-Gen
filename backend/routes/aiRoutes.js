const express = require("express");
const router = express.Router();
const {
  generateAIBlog,
  generateBlogImage,
} = require("../controllers/aiController");
const authUser = require("../middleware/user.auth");

// AI Blog Generation Routes
router.post("/api/ai/generate-blog", authUser, generateAIBlog);
router.post("/api/ai/generate-image", authUser, generateBlogImage);

module.exports = router;
