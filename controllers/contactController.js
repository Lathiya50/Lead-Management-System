// controllers/contactController.js
const Contact = require("../models/Contact");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../utils/asyncHandler");
const constants = require("../config/constants");

exports.getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ lead: req.params.leadId }).sort({
    isPrimary: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  res.status(200).json({
    success: true,
    data: contact,
  });
});

exports.createContact = asyncHandler(async (req, res) => {
  req.body.lead = req.params.leadId;

  if (req.body.isPrimary) {
    await Contact.updateMany({ lead: req.params.leadId }, { isPrimary: false });
  }

  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    data: contact,
  });
});

exports.updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  if (req.body.isPrimary) {
    await Contact.updateMany(
      { lead: contact.lead, _id: { $ne: contact._id } },
      { isPrimary: false }
    );
  }

  contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: contact,
  });
});

exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(new ErrorResponse(constants.ERROR_MESSAGES.NOT_FOUND, 404));
  }

  await contact.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
