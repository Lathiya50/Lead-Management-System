const mongoose = require("mongoose");

const KAMSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add indexes for common queries
KAMSchema.index({ email: 1 });
KAMSchema.index({ active: 1 });

module.exports = mongoose.model("KAM", KAMSchema);
