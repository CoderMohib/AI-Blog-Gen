const User = require("../model/userModel");
const Verification = require("../model/verificationModel");
const { sendEmail } = require("../utils/smtp");
const { generateToken } = require("../utils/tokenGenerate");
const bcrypt = require("bcryptjs");
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User" });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); 

    // 3. Save token in Verification collection
    const verification = new Verification({
      userId: user._id,
      type: "password_reset",
      token,
      expiresAt,
    });
    await verification.save();

    // 4. Prepare reset link
    const resetLink = `${process.env.FRONTEND_URL}/forgot-password/${token}`;

    // 5. Send reset email
    const emailResult = await sendEmail(
      user.email,
      "Reset Your Password - AI Blog Generator",
      "resetPassword.html",
      {
        username: user.fullName || user.username,
        resetLink,
      }
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email",
        error: emailResult.error,
      });
    }

    // 6. Mark as sent
    verification.sent = true;
    verification.sentAt = new Date();
    await verification.save();

    return res.json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Find verification token
    const verification = await Verification.findOne({
      token,
      type: "password_reset",
      used: false,
      expiresAt: { $gt: new Date() }, // not expired
    });

    if (!verification) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Find user
    const user = await User.findById(verification.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Hash new password and save
    user.password = password;
    await user.save();

    // Mark token as used
    verification.used = true;
    verification.usedAt = new Date();
    await verification.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};