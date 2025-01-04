const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const KAM = require("../models/KAM");
const constants = require("../config/constants");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await KAM.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }
});
