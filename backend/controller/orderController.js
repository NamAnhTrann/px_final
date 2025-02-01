const Product = require("../model/productSchema");
const Order = require("../model/orderSchema");
const User = require("../model/userSchema");

module.exports = {
  //remove product when user purchase, now how the hell do i connect this to the user
  purchaseAPI: async function (req, res) {
    try {
      const productId = req.params.id;
      const { quantity = 1, uid } = req.body;

      if (!uid) {
        console.log("User not available");
        return res.status(404).json({ message: "Error" });
      }

      const user = await User.findOne({ firebaseUid: uid });
      if (!user) {
        console.log("User cannot be found");
        return res.status(404).json({ message: "Error" });
      }

      const product = await Product.findOneAndUpdate(
        { _id: productId, productStock: { $gte: quantity } },
        { $inc: { productStock: -quantity } },
        { new: true }
      );

      if (!product) {
        return res
          .status(400)
          .json({ message: "Product not available or insufficient stock" });
      }

      const totalAmount = quantity * parseInt(product.productPrice, 10);
      console.log("Calculated total amount:", totalAmount);

      const order = new Order({
        userId: user._id,
        productId,
        quantity,
        totalAmount,
      });

      await order.save();
      user.orders.push(order._id);
      await user.save();
      console.log("Order created successfully:", order);

      return res.status(200).json({
        message: "Order created successfully",
        product,
        order,
      });
    } catch (err) {
      return res.status(400).json({ message: "error", err });
    }
  },

  listOrderApi: async function (req, res) {
    try {
      const userId = req.params.id;

      // Find all orders for the user and populate product and payment details
      const orders = await Order.find({ userId })
        .populate("productId") // Include product details
        .populate("payment"); // Include payment details

      if (!orders || orders.length === 0) {
        console.log("No orders found");
        return res.status(404).json({ message: "No orders found" });
      }

      return res.status(200).json(orders);
    } catch (err) {
      console.error("Error retrieving orders:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  },
  getSpecificOrder: async function (req, res) {
    try {
      const orderId = req.params.id;

      // Find the specific order and populate product and payment details
      const order = await Order.findById(orderId)
        .populate("productId") // Include product details
        .populate("payment"); // Include payment details

      if (!order) {
        console.log("Order not found");
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(order);
    } catch (err) {
      console.error("Error retrieving order:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    }
  },

  removeOrderApi: async function (req, res) {
    try {
      const orderId = req.params.id;

      //find the order
      const order = await Order.findById(orderId);
      if (!order) {
        console.log("there is no order");
        return res.status(400).json({ message: "No order found" });
      }
      const product = await Product.findById(order.productId);
      if (!product) {
        console.log("No product to remove");
        return res.status(400).json({ message: "Product not found" });
      }

      product.productStock += order.quantity;
      await product.save();

      await Order.findByIdAndDelete(orderId);
      console.log(`Order ${orderId} has been deleted`);

      const remainingOrders = await Order.find({ userId: order.userId });
      if (remainingOrders.length === 0) {
        // No more orders for this user, so delete the user
        await User.findByIdAndDelete(order.userId);
        console.log(`User ${order.userId} has been deleted`);
      }

      return res
        .status(200)
        .json({ message: "Order has been canceled", product });
    } catch (err) {
      return res.status(400).json({ message: "error", err });
    }
  },

  reduceQuantityOfProduct: async function (req, res) {
    try {
      const orderId = req.params.id;
      const { quantityToRemove } = req.body;

      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
        console.log("Order does not exist");
        return res.status(400).json({ message: "Order does not exist" });
      }

      if (quantityToRemove > order.quantity) {
        return res
          .status(400)
          .json({ message: "Cannot remove more than what you have" });
      }

      // Find the product
      const product = await Product.findById(order.productId);
      if (!product) {
        console.log("Product not found");
        return res.status(400).json({ message: "Product not found" });
      }

      product.productStock += quantityToRemove;
      await product.save();

      // Update the order quantity
      order.quantity -= quantityToRemove;
      if (order.quantity === 0) {
        // If quantity is zero, delete the order
        await Order.findByIdAndDelete(orderId);
        console.log(`Order ${orderId} has been deleted`);

        // Check if the user has any other orders
        const remainingOrders = await Order.find({ userId: order.userId });
        if (remainingOrders.length === 0) {
          // No more orders for this user, so delete the user
          await User.findByIdAndDelete(order.userId);
          console.log(`User ${order.userId} has been deleted`);
        }
      } else {
        // Save the updated order
        await order.save();
      }

      return res
        .status(200)
        .json({ message: "Quantity reduced successfully", order, product });
    } catch (err) {
      console.error("Error in reduceQuantityOfProduct:", err);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  },
};
