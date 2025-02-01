const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },

  totalAmount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
