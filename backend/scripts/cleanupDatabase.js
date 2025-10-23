const mongoose = require('mongoose');

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

// Clean up invalid data in the database
const cleanupDatabase = async () => {
  try {
    console.log('Starting database cleanup...');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Clean followers array - remove invalid values
    const followersResult = await usersCollection.updateMany(
      { followers: { $exists: true } },
      [
        {
          $set: {
            followers: {
              $filter: {
                input: "$followers",
                cond: { 
                  $and: [
                    { $ne: ["$$this", null] },
                    { $ne: ["$$this", ""] },
                    { $ne: ["$$this", 0] },
                    { $ne: ["$$this", "[ 0 ]"] },
                    { $ne: ["$$this", "[0]"] },
                    { $ne: ["$$this", "0"] }
                  ]
                }
              }
            }
          }
        }
      ]
    );
    console.log(`Cleaned followers for ${followersResult.modifiedCount} users`);

    // Clean following array - remove invalid values
    const followingResult = await usersCollection.updateMany(
      { following: { $exists: true } },
      [
        {
          $set: {
            following: {
              $filter: {
                input: "$following",
                cond: { 
                  $and: [
                    { $ne: ["$$this", null] },
                    { $ne: ["$$this", ""] },
                    { $ne: ["$$this", 0] },
                    { $ne: ["$$this", "[ 0 ]"] },
                    { $ne: ["$$this", "[0]"] },
                    { $ne: ["$$this", "0"] }
                  ]
                }
              }
            }
          }
        }
      ]
    );
    console.log(`Cleaned following for ${followingResult.modifiedCount} users`);

    // Clean followRequests array - remove invalid values
    const followRequestsResult = await usersCollection.updateMany(
      { followRequests: { $exists: true } },
      [
        {
          $set: {
            followRequests: {
              $filter: {
                input: "$followRequests",
                cond: { 
                  $and: [
                    { $ne: ["$$this", null] },
                    { $ne: ["$$this", ""] },
                    { $ne: ["$$this", 0] },
                    { $ne: ["$$this", "[ 0 ]"] },
                    { $ne: ["$$this", "[0]"] },
                    { $ne: ["$$this", "0"] }
                  ]
                }
              }
            }
          }
        }
      ]
    );
    console.log(`Cleaned followRequests for ${followRequestsResult.modifiedCount} users`);

    console.log('Database cleanup completed successfully!');
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
  await cleanupDatabase();
};

runCleanup();

