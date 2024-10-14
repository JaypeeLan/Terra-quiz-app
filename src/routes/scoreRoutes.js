const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");
const { protect } = require("../controllers/authController");

router
  .route("/")
  .post(protect, scoreController.saveScore)
  .get(protect, scoreController.getUserScores);
module.exports = router;
