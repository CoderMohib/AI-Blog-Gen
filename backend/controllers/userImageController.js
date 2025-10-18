const cloudinary = require("../config/cloudinary");

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Delete old image from Cloudinary if exists
    if (req.user.profileImage?.public_id) {
      await cloudinary.uploader.destroy(req.user.profileImage.public_id);
    }

    // Upload new image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Cloudinary upload failed", error });
        }
        // Save new image info in user
        req.user.profileImage = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        await req.user.save();

        res.status(200).json({ profileImage: req.user.profileImage });
      }
    );

    // Pipe the uploaded file buffer to Cloudinary
    uploadedImage.end(req.file.buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const deleteProfileImage = async (req, res) => {
  try {
    if (!req.user.profileImage?.public_id) {
      return res.status(400).json({ message: "No profile image to delete" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(req.user.profileImage.public_id);

    // Remove from user object
    req.user.profileImage = null;
    await req.user.save();

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = { uploadProfileImage, deleteProfileImage };
