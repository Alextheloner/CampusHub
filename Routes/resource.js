const express = require("express");
const Resource = require("../models/resource");
const protect = require("../middleware/auth");
const upload = require("../config/upload");

const router = express.Router();

/* Upload PDF */
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
  return res.status(400).json({ msg: "No file uploaded" });
}
    const resource = await Resource.create({
      title: req.body.title,
      description: req.body.description,
      fileUrl: req.file.path,
      uploadedBy: req.user.id
    });

    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ msg: "Upload failed" });
  }
});

/* Get all resources */
router.get("/", protect, async (req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
});

module.exports = router;
