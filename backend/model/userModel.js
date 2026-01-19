const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
      minlength: [5, "Full Name must be at least 5 characters long"],
      maxlength: [20, "Full Name cannot exceed 20 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [5, "Username must be at least 5 characters long"],
      maxlength: [15, "Username cannot exceed 15 characters"],
      unique: [true, "Username already exists"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number already exists"],
    },
    dob: {
      type: Date,
    },
    country: {
      type: String,
      default: "Not specified",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    profileImage: {
      url: { type: String, default: "" }, // The image URL to display
      public_id: { type: String, default: "" }, // The Cloudinary ID used for deletion
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for post count (computed from Blog collection)
userSchema.virtual("postCount", {
  ref: "Blog",
  localField: "_id",
  foreignField: "author",
  count: true,
});

// Instance method to get followers count
userSchema.methods.getFollowersCount = async function () {
  const Follow = require("./followModel");
  return await Follow.countDocuments({
    following: this._id,
    status: "accepted",
  });
};

// Instance method to get following count
userSchema.methods.getFollowingCount = async function () {
  const Follow = require("./followModel");
  return await Follow.countDocuments({
    follower: this._id,
    status: "accepted",
  });
};

// Instance method to get both counts at once (more efficient)
userSchema.methods.getFollowCounts = async function () {
  const Follow = require("./followModel");
  const [followersCount, followingCount] = await Promise.all([
    Follow.countDocuments({ following: this._id, status: "accepted" }),
    Follow.countDocuments({ follower: this._id, status: "accepted" }),
  ]);
  return { followersCount, followingCount };
};

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
