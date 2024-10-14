const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
