require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// ⭐ Use cors EXACTLY like the official docs say
app.use(
  cors({
    origin: "https://fittrack1pro.netlify.app",
    credentials: true,
  }),
);

app.use(express.json());

// ⭐ Routers
const goalsRouter = require("./routes/goals");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const progressRouter = require("./routes/progress");

app.use("/api/goals", goalsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/progress", progressRouter);

// ⭐ Health check
app.get("/", (req, res) => {
  res.send("Fitness Trackr API is running successfully.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
