const express = require("express");
const router = express.Router();
const Announcement = require("../models/announcement");
const auth = require("../middleware/authmiddleware");

/* create announcement */
router.post("/", auth, async (req, res) => {
  try {
    const { title, message } = req.body;

    const announcement = await Announcement.create({
      title,
      message,
      createdBy: req.user.id
    });

    res.json(announcement);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* get all announcements */
router.get("/", auth, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
