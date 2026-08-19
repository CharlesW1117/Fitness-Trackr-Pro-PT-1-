require("dotenv").config();
const express = require("express");
const app = express();

const FRONTEND = "https://fittrack1pro.netlify.app";

// ⭐ Global CORS headers (Express v5-safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ⭐ Handle OPTIONS without wildcards
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

// Routers
const goalsRouter = require("./routes/goals");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const progressRouter = require("./routes/progress");

app.use("/api/goals", goalsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);

app.get("/", (req, res) => {
  res.send("Fitness Trackr API is running successfully.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
