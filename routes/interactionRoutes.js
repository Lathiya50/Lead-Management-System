// routes/interactionRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");
const { interactionValidation } = require("../utils/validation");
const { validate } = require("../middleware/validate");
const {
  getInteractions,
  getInteraction,
  createInteraction,
  updateInteraction,
} = require("../controllers/interactionController");

router.use(protect);

router
  .route("/")
  .get(getInteractions)
  .post(interactionValidation, validate, createInteraction);

router
  .route("/:id")
  .get(getInteraction)
  .put(interactionValidation, validate, updateInteraction);

module.exports = router;
