const User = require("../model/userModel");
const getUserData = async (req, res) => {
  try {
    const decode = req.decode;
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user: user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
module.exports = getUserData;
