const Order = require("../model/orderSchema");
const Payment = require("../model/paymentSchema");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = {
  paymentApi: async function (req, res) {
    try {
      const { orderId } = req.params;

      // Find the order in the database
      const order = await Order.findById(orderId).populate("productId userId");

      if (!order) {
        console.log("Order not found in the database.");
        return res.status(400).json({ message: "Order not found" });
      }

      // Calculate the total amount from the order (e.g., product price * quantity)
      if (!order.productId || !order.productId.productPrice) {
        console.log("Product price is missing in the order.");
        return res.status(400).json({ message: "Product price is missing" });
      }

      const totalAmount = order.quantity * order.productId.productPrice; // Convert to number and remove commas
      console.log("Calculated total amount:", totalAmount);

      if (totalAmount <= 0 || null) {
        console.log("Invalid total amount:", totalAmount);
        return res.status(400).json({ message: "Invalid total amount" });
      }

      // Create a Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: "usd",
        metadata: {
          orderId: order._id,
          userId: order.userId,
        },
      });
      console.log(paymentIntent);

      // Create a Payment document
      const payment = new Payment({
        orderId: order._id,
        totalAmount: totalAmount,
        stripePaymentId: paymentIntent.id,
      });

      await payment.save();
      order.payment = payment._id;
      await order.save();
      console.log("Payment saved to database:", payment);

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        message: "Payment created successfully",
        payment,
      });
    } catch (err) {
      console.error("Error creating payment:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  },
};
