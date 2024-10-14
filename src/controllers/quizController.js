const Quiz = require("../models/quizModel");

exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json({
      message: "Quizzes fetched successfully",
      data: quizzes,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
