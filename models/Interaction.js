const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["CALL", "EMAIL", "MEETING", "OTHER"],
    },
    notes: {
      type: String,
      required: true,
    },
    outcome: {
      type: String,
      enum: [
        "SUCCESSFUL",
        "FOLLOWUP_REQUIRED",
        "NO_RESPONSE",
        "NOT_INTERESTED",
      ],
      required: true,
    },
    interactionDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      min: 0,
    },
    nextFollowUpDate: Date,
    kam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KAM",
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexes for common queries
InteractionSchema.index({ lead: 1, interactionDate: -1 });
InteractionSchema.index({ kam: 1, interactionDate: -1 });

module.exports = mongoose.model("Interaction", InteractionSchema);
