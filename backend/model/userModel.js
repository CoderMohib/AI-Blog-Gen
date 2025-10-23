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
    posts: {
      type: Number,
      default: 0,
    },
    // Follow system fields
    followers: [{ 
      type: mongoose.Schema.Types.Mixed, 
      ref: 'User'
    }],
    following: [{ 
      type: mongoose.Schema.Types.Mixed, 
      ref: 'User'
    }],
    followRequests: [{ 
      type: mongoose.Schema.Types.Mixed, 
      ref: 'User'
    }],
    isPrivate: { 
      type: Boolean, 
      default: false 
    },
    isActive: { type: Boolean, default: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Pre-save middleware to clean invalid ObjectIds
userSchema.pre('save', function(next) {
  // Clean followers array
  if (this.followers && Array.isArray(this.followers)) {
    this.followers = this.followers.filter(follower => {
      return mongoose.Types.ObjectId.isValid(follower);
    });
  }

  // Clean following array
  if (this.following && Array.isArray(this.following)) {
    this.following = this.following.filter(following => {
      return mongoose.Types.ObjectId.isValid(following);
    });
  }

  // Clean followRequests array
  if (this.followRequests && Array.isArray(this.followRequests)) {
    this.followRequests = this.followRequests.filter(request => {
      return mongoose.Types.ObjectId.isValid(request);
    });
  }

  next();
});

// Pre-find middleware to clean invalid ObjectIds when reading
userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function(next) {
  // This will be applied to all find operations
  next();
});

// Post-find middleware to clean data after reading
userSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
  if (!docs) return;
  
  const processDoc = (doc) => {
    if (!doc) return;
    
    // Clean followers array
    if (doc.followers && Array.isArray(doc.followers)) {
      doc.followers = doc.followers.filter(follower => {
        try {
          return mongoose.Types.ObjectId.isValid(follower);
        } catch (e) {
          return false;
        }
      });
    }

    // Clean following array
    if (doc.following && Array.isArray(doc.following)) {
      doc.following = doc.following.filter(following => {
        try {
          return mongoose.Types.ObjectId.isValid(following);
        } catch (e) {
          return false;
        }
      });
    }

    // Clean followRequests array
    if (doc.followRequests && Array.isArray(doc.followRequests)) {
      doc.followRequests = doc.followRequests.filter(request => {
        try {
          return mongoose.Types.ObjectId.isValid(request);
        } catch (e) {
          return false;
        }
      });
    }
  };

  if (Array.isArray(docs)) {
    docs.forEach(processDoc);
  } else {
    processDoc(docs);
  }
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Pre-save hook to clean up invalid ObjectIds in arrays
userSchema.pre("save", function (next) {
  // Clean followers array
  if (this.followers && Array.isArray(this.followers)) {
    this.followers = this.followers.filter(id => {
      if (!id) return false;
      return mongoose.Types.ObjectId.isValid(id);
    });
  }
  
  // Clean following array
  if (this.following && Array.isArray(this.following)) {
    this.following = this.following.filter(id => {
      if (!id) return false;
      return mongoose.Types.ObjectId.isValid(id);
    });
  }
  
  // Clean followRequests array
  if (this.followRequests && Array.isArray(this.followRequests)) {
    this.followRequests = this.followRequests.filter(id => {
      if (!id) return false;
      return mongoose.Types.ObjectId.isValid(id);
    });
  }
  
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
