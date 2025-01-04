const KAM = require("../models/KAM");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const constants = require("../config/constants");
const { sendTokenResponse } = require("../middleware/auth");

// @desc    Register KAM
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, timezone } = req.body;

  // Create user
  const kam = await KAM.create({
    name,
    email,
    password,
    phone,
    timezone,
  });

  sendTokenResponse(kam, 201, res);
});

// @desc    Login KAM
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Check for user
  const kam = await KAM.findOne({ email }).select("+password");

  if (!kam) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await kam.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(kam, 200, res);
});

// @desc    Get current logged in KAM
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
