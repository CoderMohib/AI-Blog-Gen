const Reminder = require("../model/reminderModel");

const addReminder = async (req, res) => {
  try {
    const { title, note } = req.body;
    const reminder = new Reminder({
      userId: req.decode.id,
      title,
      note,
    });
    await reminder.save();
    res.status(201).json({ reminder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding reminder" });
  }
};
const getReminders = async (req, res) => {
  try {
    const userId = req.decode.id;

    const reminders = await Reminder.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ reminders: reminders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reminders" });
  }
};
const updateReminder = async (req, res) => {
  try {
    const { title, note } = req.body;
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.decode.id },
      { title, note },
      { new: true }
    );
    res.json({ message: "Updated Successfully", updated: updated });
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteReminder = async (req, res) => {
  try {
    await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.decode.id,
    });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};
module.exports = { addReminder, getReminders, updateReminder, deleteReminder };
