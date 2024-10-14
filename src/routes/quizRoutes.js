const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { protect } = require("../controllers/authController");

router.route("/").get(protect, quizController.getQuizzes);

module.exports = router;
