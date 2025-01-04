// routes/contactRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");
const { contactValidation } = require("../utils/validation");
const { validate } = require("../middleware/validate");
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

router.use(protect);

router
  .route("/")
  .get(getContacts)
  .post(contactValidation, validate, createContact);

router
  .route("/:id")
  .get(getContact)
  .put(contactValidation, validate, updateContact)
  .delete(deleteContact);

module.exports = router;
