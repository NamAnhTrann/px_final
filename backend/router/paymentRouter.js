const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/payment/api/:orderId", paymentController.paymentApi);

module.exports = router;
