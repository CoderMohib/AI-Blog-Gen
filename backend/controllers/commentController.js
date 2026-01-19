const Comment = require("../model/commentModel");
const Blog = require("../model/blogModel");
const Like = require("../model/likeModel");
const mongoose = require("mongoose");

// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text, parentComment } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // If this is a reply, validate parent comment
    if (parentComment) {
      if (!mongoose.Types.ObjectId.isValid(parentComment)) {
        return res.status(400).json({
          success: false,
          message: "Invalid parent comment ID",
        });
      }

      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }

      // Ensure parent comment belongs to the same blog
      if (parentCommentDoc.blog.toString() !== blogId) {
        return res.status(400).json({
          success: false,
          message: "Parent comment does not belong to this blog",
        });
      }
    }

    // Create comment
    const comment = new Comment({
      blog: blogId,
      user: userId,
      text: text.trim(),
      parentComment: parentComment || null,
    });

    await comment.save();
    await comment.populate("user", "fullName username profileImage");

    // Create notification for blog author (if not self-comment)
    if (blog.author.toString() !== userId.toString()) {
      try {
        const {
          createBlogCommentNotification,
          emitNotification,
        } = require("./notificationController");
        const notification = await createBlogCommentNotification(
          userId,
          blog.author,
          blogId,
          comment._id
        );
        emitNotification(blog.author, notification);
      } catch (error) {
        console.error("Error creating comment notification:", error);
      }
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error adding comment",
      error: error.message,
    });
  }
};

// Get all comments for a blog
const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog ID",
      });
    }

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Build query for top-level comments only
    const query = {
      blog: blogId,
      parentComment: null,
    };

    // Calculate pagination
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 100);

    // Get total count
    const totalComments = await Comment.countDocuments(query);

    // Build sort object
    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    // Get comments
    const comments = await Comment.find(query)
      .populate("user", "fullName username profileImage")
      .populate({
        path: "repliesCount",
      })
      .sort(sortObj)
      .skip(skip)
      .limit(maxLimit);

    // Get like status for each comment if user is authenticated
    let commentsWithLikeStatus = comments;
    if (req.user) {
      commentsWithLikeStatus = await Promise.all(
        comments.map(async (comment) => {
          const liked = await Like.findOne({
            user: req.user._id,
            comment: comment._id,
          });
          return {
            ...comment.toObject(),
            liked: !!liked,
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      comments: commentsWithLikeStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalComments / maxLimit),
        totalCount: totalComments,
        hasNextPage: page < Math.ceil(totalComments / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error getting blog comments:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting comments",
      error: error.message,
    });
  }
};

// Get replies for a comment
const getCommentReplies = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Build query for replies
    const query = {
      parentComment: commentId,
    };

    // Calculate pagination
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(parseInt(limit), 50);

    // Get total count
    const totalReplies = await Comment.countDocuments(query);

    // Get replies
    const replies = await Comment.find(query)
      .populate("user", "fullName username profileImage")
      .sort({ createdAt: 1 }) // Oldest first for replies
      .skip(skip)
      .limit(maxLimit);

    // Get like status for each reply if user is authenticated
    let repliesWithLikeStatus = replies;
    if (req.user) {
      repliesWithLikeStatus = await Promise.all(
        replies.map(async (reply) => {
          const liked = await Like.findOne({
            user: req.user._id,
            comment: reply._id,
          });
          return {
            ...reply.toObject(),
            liked: !!liked,
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      replies: repliesWithLikeStatus,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReplies / maxLimit),
        totalCount: totalReplies,
        hasNextPage: page < Math.ceil(totalReplies / maxLimit),
        hasPrevPage: page > 1,
        limit: maxLimit,
      },
    });
  } catch (error) {
    console.error("Error getting comment replies:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting replies",
      error: error.message,
    });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check authorization
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this comment",
      });
    }

    // Update comment
    comment.text = text.trim();
    comment.isEdited = true;
    await comment.save();

    await comment.populate("user", "fullName username profileImage");

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating comment",
      error: error.message,
    });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // Find comment
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check authorization (user can delete their own comment or blog author can delete any comment)
    const blog = await Blog.findById(comment.blog);
    const isAuthor = comment.user.toString() === userId.toString();
    const isBlogOwner = blog && blog.author.toString() === userId.toString();

    if (!isAuthor && !isBlogOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this comment",
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: commentId });

    // Delete associated likes
    await Like.deleteMany({ comment: commentId });

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting comment",
      error: error.message,
    });
  }
};

// Toggle comment like
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);
      comment.likes = Math.max(0, comment.likes - 1);
      await comment.save();

      return res.status(200).json({
        success: true,
        message: "Comment unliked",
        liked: false,
        likeCount: comment.likes,
      });
    } else {
      // Like
      const like = new Like({
        user: userId,
        comment: commentId,
      });
      await like.save();

      comment.likes += 1;
      await comment.save();

      return res.status(200).json({
        success: true,
        message: "Comment liked",
        liked: true,
        likeCount: comment.likes,
      });
    }
  } catch (error) {
    console.error("Error toggling comment like:", error);
    res.status(500).json({
      success: false,
      message: "Server error toggling like",
      error: error.message,
    });
  }
};

// Check if user liked comment
const checkCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Validate comment ID
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
    }

    const like = await Like.findOne({
      user: userId,
      comment: commentId,
    });

    res.status(200).json({
      success: true,
      liked: !!like,
    });
  } catch (error) {
    console.error("Error checking comment like:", error);
    res.status(500).json({
      success: false,
      message: "Server error checking like status",
      error: error.message,
    });
  }
};

module.exports = {
  addComment,
  getBlogComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  toggleCommentLike,
  checkCommentLike,
};
