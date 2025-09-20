const User = require("../model/userModel");
const Verification = require("../model/verificationModel");

const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    // ✅ Check token presence
    if (!token || token.trim() === "") {
      return res.status(400).json({ message: "Activation token is required." });
    }

    // 1. Find the verification record (without filtering by used)
    const verification = await Verification.findOne({
      token,
      type: "activation",
    });

    if (!verification) {
      return res
        .status(400)
        .json({ message: "Invalid activation token." });
    }

    // 2. Check if already used
    if (verification.used) {
      return res
        .status(400)
        .json({ message: "This activation link has already been used." });
    }

    // 3. Check expiry
    if (verification.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Activation link has expired." });
    }

    // 4. Find user
    const user = await User.findById(verification.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isActive) {
      return res
        .status(200)
        .json({ message: "Account already activated. You can log in." });
    }

    // 5. Activate account
    user.isActive = true;
    await user.save();

    // 6. Mark verification as used
    verification.used = true;
    verification.usedAt = new Date();
    await verification.save();

    return res.status(200).json({
      message:
        "Your account has been activated successfully! You can now log in.",
    });
  } catch (err) {
    res.status(500).json({ message: "Activation failed", error: err.message });
  }
};

module.exports = { activateAccount };
