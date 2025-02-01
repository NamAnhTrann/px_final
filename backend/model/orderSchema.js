const mongoose = require("mongoose");

let orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
});

module.exports = mongoose.model("Order", orderSchema);
