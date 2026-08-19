require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// ✅ CORS configuration
const corsOptions = {
  origin: "https://fittrack1pro.netlify.app", // exact Netlify domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Handle preflight requests globally (Express v5‑compatible)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.set({
      "Access-Control-Allow-Origin": corsOptions.origin,
      "Access-Control-Allow-Methods": corsOptions.methods.join(", "),
      "Access-Control-Allow-Headers": corsOptions.allowedHeaders.join(", "),
      "Access-Control-Allow-Credentials": "true",
    });
    return res.sendStatus(204);
  }
  next();
});

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
