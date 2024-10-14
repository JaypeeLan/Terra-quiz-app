const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Score = mongoose.model("Score", scoreSchema);

module.exports = Score;
