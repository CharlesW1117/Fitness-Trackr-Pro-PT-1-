// ✅ Load environment variables
require("dotenv").config();

// ✅ Core dependencies
const express = require("express");
const cors = require("cors");
const app = express();

// ✅ Routers
const goalsRouter = require("./routes/goals");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const progressRouter = require("./routes/progress");

// ✅ Middleware
app.use(express.json());

// ✅ CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://fittrack1pro.netlify.app"); // ✅ exact Netlify domain
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ✅ Mount routes
app.use("/api/goals", goalsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);

// ✅ Health check route (recommended by Render Docs)
app.get("/", (req, res) => {
  res.send("Fitness Trackr API is running successfully.");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
