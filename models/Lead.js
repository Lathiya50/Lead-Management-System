const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["RESTAURANT", "CAFE", "CLOUD_KITCHEN", "OTHER"],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "CONVERTING",
        "ACTIVE",
        "INACTIVE",
      ],
      default: "NEW",
    },
    kam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KAM",
      required: true,
    },
    callFrequency: {
      type: Number, // days between calls
      default: 7,
    },
    lastCallDate: {
      type: Date,
    },
    nextCallDate: {
      type: Date,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    potentialValue: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add indexes for common queries
LeadSchema.index({ status: 1, kam: 1 });
LeadSchema.index({ nextCallDate: 1 });
LeadSchema.index({ "address.city": 1 });

module.exports = mongoose.model("Lead", LeadSchema);
