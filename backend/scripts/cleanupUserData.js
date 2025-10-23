const mongoose = require('mongoose');
const User = require('../model/userModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-blog-gen');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clean up invalid followers and following data
const cleanupUserData = async () => {
  try {
    console.log('Starting user data cleanup...');
    
    // Find all users with invalid followers/following data
    const users = await User.find({
      $or: [
        { followers: { $exists: true, $ne: [] } },
        { following: { $exists: true, $ne: [] } }
      ]
    });

    console.log(`Found ${users.length} users to check`);

    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Clean up followers array
      if (user.followers && user.followers.length > 0) {
        const validFollowers = user.followers.filter(follower => {
          // Check if it's a valid ObjectId string
          return typeof follower === 'string' && 
                 follower.length === 24 && 
                 /^[0-9a-fA-F]{24}$/.test(follower);
        });

        if (validFollowers.length !== user.followers.length) {
          console.log(`Cleaning followers for user ${user.username}: ${user.followers.length} -> ${validFollowers.length}`);
          updates.followers = validFollowers;
          needsUpdate = true;
        }
      }

      // Clean up following array
      if (user.following && user.following.length > 0) {
        const validFollowing = user.following.filter(following => {
          // Check if it's a valid ObjectId string
          return typeof following === 'string' && 
                 following.length === 24 && 
                 /^[0-9a-fA-F]{24}$/.test(following);
        });

        if (validFollowing.length !== user.following.length) {
          console.log(`Cleaning following for user ${user.username}: ${user.following.length} -> ${validFollowing.length}`);
          updates.following = validFollowing;
          needsUpdate = true;
        }
      }

      // Update user if needed
      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates);
        console.log(`Updated user: ${user.username}`);
      }
    }

    console.log('User data cleanup completed successfully!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the cleanup
const runCleanup = async () => {
  await connectDB();
  await cleanupUserData();
};

runCleanup();