const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { check } = require("express-validator");

const {
  getKAMs,
  getKAM,
  createKAM,
  updateKAM,
  deleteKAM,
  getKAMPerformance,
  getKAMDashboard,
} = require("../controllers/kamController");

// Validation rules
const kamValidation = [
  check("name").notEmpty().trim(),
  check("email").isEmail().normalizeEmail(),
  check("phone").notEmpty(),
  check("timezone").optional(),
];

// Protect all routes
router.use(protect);

router.get("/dashboard", getKAMDashboard);
router.get("/:id/performance", getKAMPerformance);

router.route("/").get(getKAMs).post(kamValidation, validate, createKAM);

router
  .route("/:id")
  .get(getKAM)
  .put(kamValidation, validate, updateKAM)
  .delete(deleteKAM);

module.exports = router;
