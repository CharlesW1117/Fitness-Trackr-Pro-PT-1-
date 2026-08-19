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
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local development
      "https://fittrack1pro.netlify.app", // ✅ correct deployed frontend
    ],
    credentials: true,
  }),
);
app.use(express.json());

// ✅ Mount routes
app.use("/api/goals", goalsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);

// ✅ Health check route (optional but recommended by Render Docs)
app.get("/", (req, res) => {
  res.send("Fitness Trackr API is running successfully.");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
