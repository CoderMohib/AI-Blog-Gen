const User = require("../model/userModel");

const deleteUser = async (req, res) => {
  try {
    const decode = req.decode;
    const user = await User.findById(decode.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(decode.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during deletion" });
  }
};

module.exports = deleteUser;
