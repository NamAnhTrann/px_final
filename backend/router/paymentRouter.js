const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");

router.post("/payment/api/:firebaseUid", paymentController.paymentApi);

module.exports = router;
