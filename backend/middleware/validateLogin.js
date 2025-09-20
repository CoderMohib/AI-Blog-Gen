const User = require("../model/userModel");
const Verification = require("../model/verificationModel");
const { sendEmail } = require("../utils/smtp");
const crypto = require("crypto");

const validateLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. If user is not activated, handle verification
    if (!user.isActive) {
      let verification = await Verification.findOne({
        userId: user._id,
        type: "activation",
        used: false,
      });

      // Check if invalid (not sent OR expired)
      const shouldRegenerate =
        !verification ||
        !verification.sent ||
        verification.expiresAt < Date.now();

      if (shouldRegenerate) {
        if (verification) await verification.deleteOne();

        const token = crypto.randomBytes(32).toString("hex");
        verification = new Verification({
          userId: user._id,
          type: "activation",
          token,
          sent: false,
          retries: 0,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        });
        await verification.save();

        const activationLink = `${process.env.FRONTEND_URL}/auth/activate/${token}`;

        // sendEmail now returns {success, error}
        const result = await sendEmail(
          user.email,
          "Activate your AI Blog Generator account",
          "activation.html",
          { username: user.username, activationLink }
        );

        if (result.success) {
          verification.sent = true;
          verification.sentAt = new Date();
          await verification.save();
        } else {
          verification.errorMessage = result.error?.message || result.error;
          verification.retries = (verification.retries || 0) + 1;
          await verification.save();

          return res.status(500).json({
            message:
              "Your account is not activated and we failed to send the verification email.",
            error: result.error?.message || result.error,
          });
        }
      }

      return res.status(403).json({
        message:
          "Your account is not activated. Please check your email for the activation link.",
      });
    }

    // Attach user to request so controller can use it
    req.user = user;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: "Login validation failed", error: err.message });
  }
};

module.exports = { validateLogin };
