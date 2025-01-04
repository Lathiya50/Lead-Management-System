// controllers/orderController.js
const Order = require("../models/Order");
const Lead = require("../models/Lead");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const constants = require("../config/constants");

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ lead: req.params.leadId }).sort(
    "-orderDate"
  );

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

exports.createOrder = asyncHandler(async (req, res) => {
  req.body.lead = req.params.leadId;

  const order = await Order.create(req.body);

  // Update lead status if first order
  await Lead.findByIdAndUpdate(req.params.leadId, {
    $inc: { totalOrders: 1 },
    status: constants.LEAD_STATUS.ACTIVE,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: order,
  });
});

exports.getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    { $match: { lead: mongoose.Types.ObjectId(req.params.leadId) } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        avgOrderValue: { $avg: "$amount" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalOrders: 0,
      totalAmount: 0,
      avgOrderValue: 0,
    },
  });
});
