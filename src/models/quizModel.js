const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true,
  },
});

const subjectSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  questions: {
    easy: [questionSchema],
    medium: [questionSchema],
    hard: [questionSchema],
  },
});

const quizSchema = new mongoose.Schema({
  questions: [subjectSchema],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
