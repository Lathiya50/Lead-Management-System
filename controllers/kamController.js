const KAM = require("../models/KAM");
const KAMService = require("../services/kamService");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const constants = require("../config/constants");

exports.getKAMs = asyncHandler(async (req, res) => {
  const kams = await KAM.find({ active: true });

  res.status(200).json({
    success: true,
    count: kams.length,
    data: kams,
  });
});

exports.getKAM = asyncHandler(async (req, res, next) => {
  const kam = await KAM.findById(req.params.id);

  if (!kam) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    data: kam,
  });
});

exports.createKAM = asyncHandler(async (req, res) => {
  const kam = await KAM.create(req.body);

  res.status(201).json({
    success: true,
    data: kam,
  });
});

exports.updateKAM = asyncHandler(async (req, res, next) => {
  let kam = await KAM.findById(req.params.id);

  if (!kam) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  kam = await KAM.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: kam,
  });
});

exports.deleteKAM = asyncHandler(async (req, res, next) => {
  const kam = await KAM.findById(req.params.id);

  if (!kam) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Soft delete by marking as inactive
  kam.active = false;
  await kam.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getKAMPerformance = asyncHandler(async (req, res, next) => {
  const kam = await KAM.findById(req.params.id);

  if (!kam) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  const startDate = new Date(
    req.query.startDate || Date.now() - 30 * 24 * 60 * 60 * 1000
  );
  const endDate = new Date(req.query.endDate || Date.now());

  const metrics = await KAMService.getPerformanceMetrics(
    req.params.id,
    startDate,
    endDate
  );

  res.status(200).json({
    success: true,
    data: metrics,
  });
});

exports.getKAMDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get metrics for today
  const metrics = await KAMService.getPerformanceMetrics(
    req.user.id,
    today,
    tomorrow
  );

  // Get leads requiring attention
  const highValueLeads = await Lead.find({
    kam: req.user.id,
    potentialValue: "HIGH",
    status: { $ne: "INACTIVE" },
  }).limit(5);

  // Get upcoming calls
  const upcomingCalls = await Lead.find({
    kam: req.user.id,
    nextCallDate: { $gte: today, $lt: tomorrow },
    status: { $ne: "INACTIVE" },
  });

  res.status(200).json({
    success: true,
    data: {
      todayMetrics: metrics,
      highValueLeads,
      upcomingCalls,
      activeLeadCount: metrics.activeLeads,
      totalRevenue: metrics.totalRevenue,
      interactionSuccess: (
        (metrics.successfulInteractions / metrics.totalInteractions) *
        100
      ).toFixed(2),
    },
  });
});
