const Quiz = require("../models/quizModel");

exports.getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find();
    const formattedQuizzes = quizzes[0].questions.map((subject) => ({
      category: subject.category,
      subject: subject.subject,
      questions: {
        easy: subject.questions.easy,
        medium: subject.questions.medium,
        hard: subject.questions.hard,
      },
    }));

    res.status(200).json({
      message: "Quizzes fetched successfully",
      data: formattedQuizzes,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
