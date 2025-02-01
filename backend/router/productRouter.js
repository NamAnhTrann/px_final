const productController = require("../controller/productController");
const express = require("express");
const router = express.Router();

router.post("/add/product/api", productController.addProductAPI);
router.get("/get/product", productController.getProductAPI);
router.get("/get/product/:id", productController.getProductIdAPI);
module.exports = router;
