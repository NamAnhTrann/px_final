const Order = require("../model/orderSchema");
const Payment = require("../model/paymentSchema");
const User = require("../model/userSchema");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const client_url = process.env.CLIENT_URL; // ✅ Use env variable directly

module.exports = {
  paymentApi: async function (req, res) {
    try {
      const { firebaseUid } = req.params;

      // Find the user
      const user = await User.findOne({ firebaseUid }).populate("orders");
      if (!user || !user.orders.length) {
        return res
          .status(400)
          .json({ message: "No orders found for this user" });
      }

      // ✅ Declare `orderIds` at the beginning
      let totalAmount = 0;
      const lineItems = [];
      const orderIds = []; // ✅ Initialize the array

      for (const order of user.orders) {
        await order.populate("productId");

        if (!order.productId || !order.productId.productPrice) {
          return res.status(400).json({ message: "Product price is missing" });
        }

        totalAmount += order.quantity * order.productId.productPrice;
        orderIds.push(order._id);

        // Prepare Stripe Checkout line items
        lineItems.push({
          price_data: {
            currency: "vnd",
            product_data: {
              name: order.productId.productName,
            },
            unit_amount: Math.round(order.productId.productPrice), // No *100 for VND
          },
          quantity: order.quantity,
        });
      }

      if (totalAmount <= 0) {
        return res.status(400).json({ message: "Invalid total amount" });
      }

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${client_url}`,
        cancel_url: `${client_url}`,
        metadata: { firebaseUid: user.firebaseUid },
      });

      // ✅ Delete the paid orders from the Order collection
      await Order.deleteMany({ _id: { $in: orderIds } });

      // ✅ Remove paid orders from the User's orders array
      await User.updateOne(
        { firebaseUid: firebaseUid },
        { $pull: { orders: { $in: orderIds } } }
      );

      // ✅ Add Logs for Successful Payment and Order Deletion
      console.log("====================================");
      console.log("✅ Payment Successful!");
      console.log(`💳 Stripe Session ID: ${session.id}`);
      console.log(`💰 Total Amount Paid: ${totalAmount.toLocaleString()} VND`);
      console.log(`👤 User Firebase UID: ${user.firebaseUid}`);
      console.log("🗑️ Orders Deleted:", orderIds);
      console.log("====================================");

      res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("Error creating payment session:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  },
};
