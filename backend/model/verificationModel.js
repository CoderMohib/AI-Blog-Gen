const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["activation", "password_reset", "other"], // extend as needed
      required: true,
    },
    token: {
      type: String,
      required: true,
      index: true, // faster lookups
      unique: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
    retries: {
      type: Number,
      default: 0,
    },
    lastTriedAt: {
      type: Date,
    },
    errorMessage: {
      type: String, // last error message if sending failed
    },
    expiresAt: {
      type: Date, // token expiry
      required: true,
    },
    used: {
      type: Boolean,
      default: false, // true once token has been consumed (e.g., activated or reset)
    },
    usedAt: {
      type: Date,
    },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

// Optional: auto-delete expired verifications (TTL index)
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Verification", verificationSchema);
