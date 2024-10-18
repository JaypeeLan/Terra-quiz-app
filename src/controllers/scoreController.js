const Score = require("../models/scoreModel");

exports.saveScore = async (req, res, next) => {
  try {
    const { subject, category, score } = req.body;
    const newScore = await Score.create({
      user: req.user._id,
      subject,
      category,
      score,
    });

    res.status(201).json({
      message: "Score saved successfully",
      data: newScore,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserScores = async (req, res, next) => {
  try {
    const scores = await Score.find({ user: req.user._id }).populate("subject");
    res.status(200).json({
      message: "Scores fetched successfully",
      data: scores,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
