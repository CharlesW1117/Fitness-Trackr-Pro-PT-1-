require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// ✅ Allowlist of permitted origins
const allowedOrigins = [
  "https://fittrack1pro.netlify.app",
  "http://localhost:3000",
];

// ✅ Dynamic CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Handle same-origin or curl requests (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Apply CORS before routes
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Handle preflight requests explicitly
app.options("*", cors(corsOptions));

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
