const mongoose = require("mongoose");
let userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  userLastName: {
    type: String,
    required: true,
    default: "Unknown",
  },
  userFirstName: {
    type: String,
    required: true,
    default: "Unknown",
  },
  useAdress: {
    type: String,
    required: true,
    default: "none",
  },
  userEmail: {
    type: String,
    required: false,
  },
  userPhoneNumber: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
