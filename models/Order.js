const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "CONFIRMED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    orderDate: {
      type: Date,
      required: true,
    },
    deliveryDate: Date,
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

// Add indexes for common queries
OrderSchema.index({ lead: 1, orderDate: -1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", OrderSchema);
