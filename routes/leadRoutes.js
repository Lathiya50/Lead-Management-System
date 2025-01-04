const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { leadValidation } = require("../utils/validation");
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
  getTodayCalls,
  updateLeadStatus,
} = require("../controllers/leadController");

// Custom validation for status update
const { check } = require("express-validator");
const constants = require("../config/constants");

const statusValidation = [
  check("status")
    .isIn(Object.values(constants.LEAD_STATUS))
    .withMessage("Invalid status"),
];

// Protect all routes
router.use(protect);

// Get today's calls
router.get("/calls/today", getTodayCalls);

// Main routes
router.route("/").get(getLeads).post(leadValidation, validate, createLead);

router
  .route("/:id")
  .get(getLead)
  .put(leadValidation, validate, updateLead)
  .delete(deleteLead);

// Additional routes
router.get("/:id/stats", getLeadStats);
router.patch("/:id/status", statusValidation, validate, updateLeadStatus);

// Export router
module.exports = router;
