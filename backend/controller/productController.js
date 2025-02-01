const Product = require("../model/productSchema");
const mongoose = require("mongoose");

module.exports = {
  //add product (admin)
  addProductAPI: async function (req, res) {
    console.log("Request Body:", req.body); //logging errors cause i suck
    try {
      const productImage = req.body.productImage;
      if (!productImage) {
        console.log("Image path isn't here");
        return res.status(400).json({ message: "Error in the image path" });
      } else {
        const newProduct = new Product({
          ...req.body,
        });
        await newProduct.save();
        console.log("Saved Success");
        return res.status(201).json({ message: "Saved successfully" });
      }
    } catch (err) {
      console.log("Error"); //logging errors cause i suck
      return res.status(400).json({ message: "Encounter error", err });
    }
  },

  // get product (admin and user)
  getProductAPI: async function (req, res) {
    try {
      const products = await Product.find({});
      if (!products) {
        console.log("Product do not exist"); //logging errors cause i suck
      } else {
        res.status(200).json(products);
      }
    } catch (err) {
      res.status(404).json({ message: "failed to get" });
    }
  },

  // get product params id -- specific product id (user)
  getProductIdAPI: async function (req, res) {
    try {
      const productId = req.params.id;
      const getProductId = await Product.findById(productId);
      if (!getProductId) {
        console.log("Error getting plants"); //logging errors cause i suck
        return res.status(400).json({ message: "Error getting plant id" });
      } else {
        console.log(`plant retrieved: ${getProductId}`); //LETS GO
        res.status(200).json([getProductId]);
      }
    } catch (err) {
      console.log("wtf is this error even about dude");
      res.status(400).json({ message: "error", err });
    }
  },
};
