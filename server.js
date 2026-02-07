const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
// const resourcesRoutes = require("./Routes/resources");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./Routes/auth"));
app.use("/api/timetable", require("./Routes/timetable"));
app.use("/api/announcements", require("./Routes/announcement"));
// app.use("/api/resources", require("./Routes/resources"));



app.get("/", (req, res) => {
  res.send("CampusHub API running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const auth = require("./middleware/authMiddleware");

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

