const ErrorResponse = require("../utils/errorResponse");
const constants = require("../config/constants");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = constants.ERROR_MESSAGES.NOT_FOUND;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = constants.ERROR_MESSAGES.DUPLICATE_ENTRY;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || constants.ERROR_MESSAGES.SERVER_ERROR,
  });
};

module.exports = errorHandler;
