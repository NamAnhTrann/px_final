const User = require("../model/userSchema");
const Order = require("../model/orderSchema");

module.exports = {
  getUserDetail: async function (req, res) {
    try {
      const user = await User.find({}).populate("orders");
      if (!user || user.length === 0) {
        console.log("user is not in the database");
      } else {
        res.status(200).json(user);
      }
    } catch (err) {
      res.status(400).json({ nessage: "Cannot retrieve user" });
    }
  },
  //my dumbass use firebaseuid in the frontend now everything has to change ffs
  getSpecificUser: async function (req, res) {
    try {
      const firebaseUid = req.params.id; // This is actually the Firebase UID, not MongoDB _id

      console.log("Looking for user with Firebase UID:", firebaseUid);

      // Find user using firebaseUid instead of _id
      const user = await User.findOne({ firebaseUid }).populate({
        path: "orders",
        populate: { path: "productId payment" }, // Nested populate for product and payment
      });
      if (!user) {
        console.log("User not found in database.");
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Fetched user:", user);
      res.status(200).json(user);
    } catch (err) {
      console.error("Error finding user:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  },

  updateUserApi: async function (req, res) {
    try {
      const firebaseUid = req.params.id; // Use Firebase UID
      if (!firebaseUid) {
        return res.status(400).json({ message: "Nothing to update" });
      }

      let userLastName = req.body.userLastName;
      let userFirstName = req.body.userFirstName;

      const updateUser = await User.findOneAndUpdate(
        { firebaseUid: firebaseUid }, // Find user by Firebase UID
        { $set: { userLastName, userFirstName } }, // Only update provided fields
        { new: true } // Return the updated document
      );

      if (!updateUser) {
        return res.status(400).json({ message: "No user found" });
      } else {
        return res.status(200).json({ message: "User Updated", updateUser });
      }
    } catch (err) {
      return res.status(400).json({ message: "Error" });
    }
  },
};
