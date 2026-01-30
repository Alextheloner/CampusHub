const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/timetable", require("./Routes/timetable"));
app.use("/api/announcements", require("./Routes/announcement"));

// Serve static files from public directory
// API routes are handled above, static files (HTML/CSS/JS) are served from public/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const auth = require("./middleware/authmiddleware");

app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    msg: "Welcome to CampusHub dashboard",
    userId: req.user.id,
  });
});

// test route to get all users
const User = require("./models/user");

app.get("/api/test-users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

