const Blog = require("../model/blogModel");
const Like = require("../model/likeModel");
const User = require("../model/userModel");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      tags,
      status,
      image,
      isAIGenerated,
      aiPrompt,
    } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Create blog
    const blog = new Blog({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      tags: tags || [],
      status: status || "draft",
      author: userId,
      image: image || { url: "", public_id: "" },
      isAIGenerated: isAIGenerated || false,
      aiPrompt: aiPrompt || "",
      publishedAt: status === "published" ? new Date() : null,
    });

    await blog.save();

    // Populate author details
    await blog.populate("author", "fullName username profileImage");

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error creating blog",
      error: error.message,
    });
  }
};

// Get all blogs with pagination and filters
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = "published",
      search = "",
      tags = "",
      author = "",
    } = req.query;

    // Build query
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search in title and content
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagArray };
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 100); // Max 100 items per page

    // Get total count
    const totalBlogs = await Blog.countDocuments(query);

    // Get blogs
    const blogs = await Blog.find(query)
      .populate("author", "fullName username profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(maxLimit);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBlogs / maxLimit),
        totalCount: totalBlogs,
        hasNextPage: page < Math.ceil(totalBlogs / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error getting blogs:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting blogs",
      error: error.message,
    });
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const blog = await Blog.findById(id)
      .populate("author", "fullName username profileImage bio")
      .populate({
        path: "commentCount",
      });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Error getting blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting blog",
      error: error.message,
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { title, content, excerpt, tags, status, image } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Find blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check authorization
    if (blog.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this blog",
      });
    }

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (tags) blog.tags = tags;
    if (image) blog.image = image;

    // Handle status change
    if (status && status !== blog.status) {
      blog.status = status;
      if (status === "published" && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();
    await blog.populate("author", "fullName username profileImage");

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating blog",
      error: error.message,
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Find blog
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check authorization
    if (blog.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this blog",
      });
    }

    // Delete image from Cloudinary if exists
    if (blog.image && blog.image.public_id) {
      try {
        await cloudinary.uploader.destroy(blog.image.public_id);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete associated likes
    await Like.deleteMany({ blog: id });

    // Delete associated comments (will be handled by comment controller)
    const Comment = require("../model/commentModel");
    await Comment.deleteMany({ blog: id });

    // Delete blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting blog",
      error: error.message,
    });
  }
};

// Upload blog image
const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog-images",
      transformation: [
        { width: 1200, height: 630, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error("Error uploading blog image:", error);
    res.status(500).json({
      success: false,
      message: "Server error uploading image",
      error: error.message,
    });
  }
};

// Toggle blog like
const toggleBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      blog: id,
    });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      blog.likes = Math.max(0, blog.likes - 1);
      await blog.save();

      return res.status(200).json({
        success: true,
        message: "Blog unliked",
        liked: false,
        likeCount: blog.likes,
      });
    } else {
      // Like
      const like = new Like({
        user: userId,
        blog: id,
      });
      await like.save();

      blog.likes += 1;
      await blog.save();

      // Create notification for blog author (if not self-like)
      if (blog.author.toString() !== userId.toString()) {
        try {
          const {
            createBlogLikeNotification,
            emitNotification,
          } = require("./notificationController");
          const notification = await createBlogLikeNotification(
            userId,
            blog.author,
            id
          );
          emitNotification(blog.author, notification);
        } catch (error) {
          console.error("Error creating like notification:", error);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Blog liked",
        liked: true,
        likeCount: blog.likes,
      });
    }
  } catch (error) {
    console.error("Error toggling blog like:", error);
    res.status(500).json({
      success: false,
      message: "Server error toggling like",
      error: error.message,
    });
  }
};

// Check if user liked blog
const checkBlogLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    const like = await Like.findOne({
      user: userId,
      blog: id,
    });

    res.status(200).json({
      success: true,
      liked: !!like,
    });
  } catch (error) {
    console.error("Error checking blog like:", error);
    res.status(500).json({
      success: false,
      message: "Server error checking like status",
      error: error.message,
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  toggleBlogLike,
  checkBlogLike,
};
