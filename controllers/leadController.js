const Lead = require("../models/Lead");
const LeadService = require("../services/leadService");
const Contact = require("../models/Contact");
const Interaction = require("../models/Interaction");
const Order = require("../models/Order");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const { getPagination } = require("../utils/pagination");
const constants = require("../config/constants");

/**
 * @desc    Get all leads with filtering, sorting, and pagination
 * @route   GET /api/v1/leads
 * @access  Private
 */
exports.getLeads = asyncHandler(async (req, res) => {
  const { page, limit, startIndex } = getPagination(req.query);

  // Build query
  const queryObj = { kam: req.user.id };

  // Filter by status
  if (req.query.status) {
    queryObj.status = req.query.status;
  }

  // Filter by business type
  if (req.query.businessType) {
    queryObj.businessType = req.query.businessType;
  }

  // Filter by potential value
  if (req.query.potentialValue) {
    queryObj.potentialValue = req.query.potentialValue;
  }

  // Search by restaurant name
  if (req.query.search) {
    queryObj.restaurantName = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  // Create query
  let query = Lead.find(queryObj);

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  query = query.skip(startIndex).limit(limit);

  // Populate KAM details
  if (req.query.populate) {
    query = query.populate("kam", "name email");
  }

  // Execute query
  const leads = await query;
  const total = await Lead.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    count: leads.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: leads,
  });
});

/**
 * @desc    Get single lead with detailed information
 * @route   GET /api/v1/leads/:id
 * @access  Private
 */
exports.getLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id).populate("kam", "name email");

  if (!lead) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Check ownership
  if (lead.kam.toString() !== req.user.id) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  // Get additional data if requested
  if (req.query.details === "full") {
    const contacts = await Contact.find({ lead: lead._id });
    const interactions = await Interaction.find({ lead: lead._id })
      .sort("-interactionDate")
      .limit(5);
    const orders = await Order.find({ lead: lead._id })
      .sort("-orderDate")
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        lead,
        contacts,
        recentInteractions: interactions,
        recentOrders: orders,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: lead,
  });
});

/**
 * @desc    Create new lead
 * @route   POST /api/v1/leads
 * @access  Private
 */
exports.createLead = asyncHandler(async (req, res) => {
  // Add KAM to req.body
  req.body.kam = req.user.id;

  // Set default call frequency if not provided
  if (!req.body.callFrequency) {
    req.body.callFrequency = 7; // Default 7 days
  }

  // Calculate next call date
  req.body.nextCallDate = new Date(
    Date.now() + req.body.callFrequency * 24 * 60 * 60 * 1000
  );

  const lead = await Lead.create(req.body);

  // Create initial contact if provided
  if (req.body.primaryContact) {
    await Contact.create({
      lead: lead._id,
      ...req.body.primaryContact,
      isPrimary: true,
    });
  }

  res.status(201).json({
    success: true,
    data: lead,
  });
});

/**
 * @desc    Update lead
 * @route   PUT /api/v1/leads/:id
 * @access  Private
 */
exports.updateLead = asyncHandler(async (req, res, next) => {
  let lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Check ownership
  if (lead.kam.toString() !== req.user.id) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  // Update call frequency and next call date if provided
  if (req.body.callFrequency) {
    req.body.nextCallDate = new Date(
      Date.now() + req.body.callFrequency * 24 * 60 * 60 * 1000
    );
  }

  lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: lead,
  });
});

/**
 * @desc    Delete lead
 * @route   DELETE /api/v1/leads/:id
 * @access  Private
 */
exports.deleteLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Check ownership
  if (lead.kam.toString() !== req.user.id) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  // Instead of deleting, mark as inactive
  lead.status = constants.LEAD_STATUS.INACTIVE;
  lead.active = false;
  await lead.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get lead statistics
 * @route   GET /api/v1/leads/:id/stats
 * @access  Private
 */
exports.getLeadStats = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Check ownership
  if (lead.kam.toString() !== req.user.id) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  // Get date range from query or default to last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (parseInt(req.query.days) || 30));

  const stats = await LeadService.getLeadPerformance(
    req.params.id,
    startDate,
    endDate
  );

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @desc    Get today's calls
 * @route   GET /api/v1/leads/calls/today
 * @access  Private
 */
exports.getTodayCalls = asyncHandler(async (req, res) => {
  const leads = await LeadService.getLeadsForToday(req.user.id);

  res.status(200).json({
    success: true,
    count: leads.length,
    data: leads,
  });
});

/**
 * @desc    Update lead status
 * @route   PATCH /api/v1/leads/:id/status
 * @access  Private
 */
exports.updateLeadStatus = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  // Check ownership
  if (lead.kam.toString() !== req.user.id) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.UNAUTHORIZED, 401));
  }

  // Validate status transition
  if (!isValidStatusTransition(lead.status, req.body.status)) {
    return next(new ErrorResponse("Invalid status transition", 400));
  }

  lead.status = req.body.status;
  await lead.save();

  res.status(200).json({
    success: true,
    data: lead,
  });
});

// Helper function to validate status transitions
function isValidStatusTransition(currentStatus, newStatus) {
  const validTransitions = {
    [constants.LEAD_STATUS.NEW]: [
      constants.LEAD_STATUS.CONTACTED,
      constants.LEAD_STATUS.INACTIVE,
    ],
    [constants.LEAD_STATUS.CONTACTED]: [
      constants.LEAD_STATUS.QUALIFIED,
      constants.LEAD_STATUS.INACTIVE,
    ],
    [constants.LEAD_STATUS.QUALIFIED]: [
      constants.LEAD_STATUS.CONVERTING,
      constants.LEAD_STATUS.INACTIVE,
    ],
    [constants.LEAD_STATUS.CONVERTING]: [
      constants.LEAD_STATUS.ACTIVE,
      constants.LEAD_STATUS.INACTIVE,
    ],
    [constants.LEAD_STATUS.ACTIVE]: [constants.LEAD_STATUS.INACTIVE],
    [constants.LEAD_STATUS.INACTIVE]: [constants.LEAD_STATUS.NEW],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}
