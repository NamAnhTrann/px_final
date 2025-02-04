const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
  orderId: [
    {
      // Change from single ObjectId to an array
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
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
