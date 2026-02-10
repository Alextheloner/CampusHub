const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const auth = require("./middleware/authmiddleware");
const User = require("./models/user");

const app = express();

// Connect DB (on Vercel, connection may be reused across invocations)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// API routes
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/timetable", require("./Routes/timetable"));
app.use("/api/announcements", require("./Routes/announcement"));

app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    msg: "Welcome to CampusHub dashboard",
    userId: req.user.id,
  });
});

app.get("/api/test-users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Static and root
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start server only when not in Vercel (serverless)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
