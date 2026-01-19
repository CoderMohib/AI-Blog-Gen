const User = require("../model/userModel");
const Verification = require("../model/verificationModel");
const { sendEmail } = require("../utils/smtp");
const { generateToken } = require("../utils/tokenGenerate");

const register = async (req, res) => {
  try {
    const { fullName, username, email, password, phone } = req.body;

    // 1. Create user
    const newUser = new User({
      fullName,
      username,
      email,
      password,
      phone,
      isActivated: false, // default
    });
    await newUser.save();

    // 2. Try to send activation email (don't fail registration if email fails)
    try {
      const token = generateToken();
      const verification = await Verification.create({
        userId: newUser._id,
        type: "activation",
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24h
      });

      const activationLink = `${process.env.FRONTEND_URL}/auth/activate/${token}`;

      const result = await sendEmail(
        email,
        "Activate your AI Blog Generator account",
        "activation.html",
        { username, activationLink },
      );

      if (result.success) {
        verification.sent = true;
        verification.sentAt = new Date();
        await verification.save();
      } else {
        verification.errorMessage = result.error;
        await verification.save();
      }
    } catch (emailError) {
      // Log email error but don't fail registration
      console.error("Failed to send activation email:", emailError.message);
    }

    // 3. Respond with success (even if email failed)
    res.status(201).json({
      message:
        "Account registered successfully. Please check your email to activate your account.",
      userId: newUser._id,
    });
  } catch (err) {
    // Handle MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      let message = "";

      if (field === "phone") {
        message = "Phone number is already registered";
      } else if (field === "email") {
        message = "Email is already registered";
      } else if (field === "username") {
        message = "Username is already taken";
      } else {
        message = `${field} already exists`;
      }

      return res.status(409).json({ message });
    }

    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

module.exports = register;
