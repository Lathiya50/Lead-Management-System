const { check } = require("express-validator");
const constants = require("../config/constants");

exports.leadValidation = [
  check("restaurantName")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required"),
  check("businessType")
    .isIn(Object.values(constants.BUSINESS_TYPE))
    .withMessage("Invalid business type"),
  check("status")
    .isIn(Object.values(constants.LEAD_STATUS))
    .withMessage("Invalid status"),
];

exports.contactValidation = [
  check("name").trim().notEmpty().withMessage("Contact name is required"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("phone").notEmpty().withMessage("Phone number is required"),
];

exports.interactionValidation = [
  check("type")
    .isIn(Object.values(constants.INTERACTION_TYPE))
    .withMessage("Invalid interaction type"),
  check("notes").trim().notEmpty().withMessage("Notes are required"),
  check("outcome")
    .isIn(Object.values(constants.INTERACTION_OUTCOME))
    .withMessage("Invalid outcome"),
];
