const express = require("express");
const router = express.Router();
const orderController = require("../controller/orderController");

router.post("/purchase/product/:id", orderController.purchaseAPI);
router.delete("/cancel/order/:id", orderController.removeOrderApi);
router.put(
  "/decrease/order/quantity/:id",
  orderController.reduceQuantityOfProduct
);
router.get("/list/orders/:id", orderController.listOrderApi);
module.exports = router;
