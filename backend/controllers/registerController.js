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

    // 2. Create activation token
    const token = generateToken();
    const verification = await Verification.create({
      userId: newUser._id,
      type: "activation",
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 24h
    });

    // 3. Prepare activation link
    const activationLink = `${process.env.FRONTEND_URL}/auth/activate/${token}`;

    // 4. Try sending email
    const result = await sendEmail(
      email,
      "Activate your AI Blog Generator account",
      "activation.html",
      { username, activationLink }
    );

    if (result.success) {
      verification.sent = true;
      verification.sentAt = new Date();
      await verification.save();
    } else {
      verification.errorMessage = result.error;
      await verification.save();
    }

    // 5. Respond
    res.status(201).json({
      message:
        "Account registered successfully. Please check your email to activate your account.",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

module.exports = register;
