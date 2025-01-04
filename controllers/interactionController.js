const Interaction = require("../models/Interaction");
const Lead = require("../models/Lead");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const constants = require("../config/constants");

exports.getInteractions = asyncHandler(async (req, res) => {
  const interactions = await Interaction.find({ lead: req.params.leadId })
    .sort("-interactionDate")
    .populate("kam", "name email");

  res.status(200).json({
    success: true,
    count: interactions.length,
    data: interactions,
  });
});

exports.createInteraction = asyncHandler(async (req, res) => {
  req.body.lead = req.params.leadId;
  req.body.kam = req.user.id;

  const interaction = await Interaction.create(req.body);

  if (req.body.type === "CALL") {
    await Lead.findByIdAndUpdate(req.params.leadId, {
      lastCallDate: req.body.interactionDate,
      $inc: { totalInteractions: 1 },
    });
  }

  res.status(201).json({
    success: true,
    data: interaction,
  });
});

exports.getInteraction = asyncHandler(async (req, res, next) => {
  const interaction = await Interaction.findById(req.params.id).populate(
    "kam",
    "name email"
  );

  if (!interaction) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    data: interaction,
  });
});

exports.updateInteraction = asyncHandler(async (req, res, next) => {
  let interaction = await Interaction.findById(req.params.id);

  if (!interaction) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  if (interaction.kam.toString() !== req.user.id) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  interaction = await Interaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: interaction,
  });
});
