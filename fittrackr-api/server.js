require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// ✅ CORS configuration
app.use(
  cors({
    origin: "https://fittrack1pro.netlify.app", // exact Netlify domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ✅ Handle preflight requests safely
app.options("/*", cors()); // ← valid wildcard pattern

app.use(express.json());

// ✅ Routers
const goalsRouter = require("./routes/goals");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const progressRouter = require("./routes/progress");

// ✅ Mount routes
app.use("/api/goals", goalsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Fitness Trackr API is running successfully.");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
