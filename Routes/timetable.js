const express = require("express");
const Timetable = require("../models/timetable");
const auth = require("../middleware/authmiddleware");

const router = express.Router();

/* ===== ADD CLASS ===== */
router.post("/", auth, async (req, res) => {
  try {
    const { courseName, day, startTime, endTime, location } = req.body;

    if (!courseName || !day || !startTime || !endTime) {
      return res.status(400).json({ msg: "Please fill all required fields" });
    }

    const newClass = await Timetable.create({
      user: req.user.id,
      courseName,
      day,
      startTime,
      endTime,
      location,
    });

    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ===== GET MY TIMETABLE ===== */
router.get("/", auth, async (req, res) => {
  try {
    const timetable = await Timetable.find({ user: req.user.id }).sort({
      day: 1,
      startTime: 1,
    });

    res.json(timetable);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ===== UPDATE CLASS ===== */
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = await Timetable.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Class not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ===== DELETE CLASS ===== */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Timetable.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ msg: "Class not found" });

    res.json({ msg: "Class removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
