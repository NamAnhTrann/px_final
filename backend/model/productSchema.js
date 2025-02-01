const mongoose = require("mongoose");

let productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: String,
    required: true,
  },
  productSize: {
    type: Number,
    enum: ["small", "medium", "collection"],
    required: true,
  },
  productDate: {
    type: Date,
    default: Date.now,
  },
  productDescription: {
    type: String,
    reqiured: false,
  },
  productStock: {
    type: Number,
  },
  productImage: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
