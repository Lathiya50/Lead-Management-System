// middleware/validate.js
const { validationResult } = require("express-validator");
const ErrorResponse = require("../utils/errorResponse");
const constants = require("../config/constants");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ErrorResponse(
        constants.ERROR_MESSAGES.VALIDATION_ERROR,
        400,
        errors.array()
      )
    );
  }
  next();
};
