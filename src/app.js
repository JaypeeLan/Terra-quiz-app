require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/errorHandler");
const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const { port, nodeEnv, apiPrefix } = require("./config/server");
const connectDB = require("./config/database");
const { AppError } = require("./middleware/errorHandler");

const app = express();
app.use(cors());

connectDB();

app.use(helmet());

// Request logging
if (nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/quizzes`, quizRoutes);
app.use(`${apiPrefix}/scores`, scoreRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running in ${nodeEnv} mode on port ${port}`);
});

module.exports = app;
