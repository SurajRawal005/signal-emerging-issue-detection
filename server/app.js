const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Signal API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

module.exports = app;