const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle specific known errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Invalid input data",
      success: false,
      data: err.errors,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
      success: false,
      data: null,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate field value entered",
      success: false,
      data: null,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token. Please log in again.",
      success: false,
      data: null,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Your token has expired. Please log in again.",
      success: false,
      data: null,
    });
  }

  // Handle AppError (Operational errors)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      message: err.message,
      success: false,
      data: null,
    });
  }

  // Catch-all for unexpected errors
  res.status(500).json({
    message: "Internal server error",
    success: false,
    data: null,
  });
};

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
