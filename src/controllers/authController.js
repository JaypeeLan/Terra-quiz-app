const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { AppError } = require("../middleware/errorHandler");
// const EmailService = require("../services/emailService");
const crypto = require("crypto");
const BlacklistedToken = require("../models/blacklistToken");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// const signVerificationToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.VERIFICATION_SECRET, {
//     expiresIn: "1h",
//   });
// };

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email is already registered", 400));
    }

    const newUser = await User.create({ name, email, password });

    const token = signToken(newUser._id);

    res.status(201).json({
      message: "User signed up successfully",
      data: { user: newUser, token },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "User logged in successfully",
      data: { name: user.name, email: user.email, token },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new AppError("You are not logged in!", 401));
    }

    await BlacklistedToken.create({ token });

    res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to access.", 401)
      );
    }

    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// exports.register = async (req, res, next) => {
//   try {
//     const newUser = await User.create(req.body);

//     const verificationToken = signVerificationToken(newUser._id);
//     newUser.verificationToken = verificationToken;
//     await newUser.save();

//     const verificationUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/api/v1/auth/verify/${verificationToken}`;

//     const emailService = new EmailService(newUser, verificationUrl);
//     await emailService.sendVerification();

//     res.status(201).json({
//       message: "User registered. Please verify your email.",
//       success: true,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.verifyAccount = async (req, res, next) => {
//   try {
//     const { token } = req.params;

//     const decoded = jwt.verify(token, process.env.VERIFICATION_SECRET);
//     const user = await User.findOne({
//       _id: decoded.id,
//       verificationToken: token,
//     });

//     if (!user) {
//       return next(new AppError("Invalid or expired verification token", 400));
//     }

//     if (user.isVerified) {
//       return next(new AppError("User is already verified", 400));
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.status(200).json({
//       message: "Account verified successfully.",
//       success: true,
//     });
//   } catch (err) {
//     if (err instanceof jwt.JsonWebTokenError) {
//       return next(new AppError("Invalid token. Please try again.", 400));
//     }
//     next(err);
//   }
// };

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new AppError("There is no user with this email address", 404)
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the reset token before saving it in the database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Update user with the reset token and expiration date
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 10000; // Token expires after 10 minutes

    // Save user to database
    await user.save();

    // Send reset token to user's email (just logging for now)
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    res.status(200).json({
      message: "Password reset link sent!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Hash the token from the URL before comparing it
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find the user based on the hashed token and check if the token is still valid (not expired)
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if token has not expired
    });

    if (!user) {
      return next(new AppError("Token is invalid or expired", 400));
    }

    // Update user's password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
      message: "Password reset successful",
      data: { token },
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
