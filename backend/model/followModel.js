const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    respondedAt: {
      type: Date,
    },
  },
  { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true },
    timestamps: true 
  }
);

// Compound index to ensure one follow relationship per user pair
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// Index for efficient queries
followSchema.index({ follower: 1, status: 1 });
followSchema.index({ following: 1, status: 1 });

// Pre-save middleware to update respondedAt when status changes
followSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.respondedAt = new Date();
  }
  next();
});

const Follow = mongoose.model("Follow", followSchema);
module.exports = Follow;

