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

// Routes
app.use("/api/auth", require("./Routes/auth"));

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
