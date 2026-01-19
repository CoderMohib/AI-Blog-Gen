const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: false, // Will be null for comment likes
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false, // Will be null for blog likes
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Compound index to ensure one like per user per blog/comment
likeSchema.index(
  { user: 1, blog: 1 },
  { unique: true, partialFilterExpression: { blog: { $exists: true } } }
);
likeSchema.index(
  { user: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $exists: true } } }
);

// Ensure either blog or comment is provided, but not both
likeSchema.pre("save", function (next) {
  if ((!this.blog && !this.comment) || (this.blog && this.comment)) {
    return next(
      new Error("Either blog or comment must be provided, but not both")
    );
  }
  next();
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
