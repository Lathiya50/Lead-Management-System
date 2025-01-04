const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    preferredContactTime: {
      type: String,
      enum: ["MORNING", "AFTERNOON", "EVENING"],
      default: "MORNING",
    },
  },
  { timestamps: true }
);

// Add indexes for common queries
ContactSchema.index({ lead: 1, isPrimary: 1 });
ContactSchema.index({ email: 1 });

module.exports = mongoose.model("Contact", ContactSchema);
