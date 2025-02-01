const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./model/userSchema");

const productRouter = require("./router/productRouter");
const orderRouter = require("./router/orderRouter");
const userRouter = require("./router/userRouter");
const paymentRouter = require("./router/paymentRouter");

const app = express();
app.use(express.json());

// ✅ Use Routes Without `/api`
app.use(productRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(paymentRouter);

const db_url = process.env.DB_URL;
const port_no = process.env.PORT_NO || 3000;

// ✅ Only Serve Frontend in Local Dev Mode
if (process.env.NODE_ENV !== "production") {
  app.use(
    express.static(
      path.join(__dirname, "../frontend/PxAng/dist/px-ang/browser")
    )
  );

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/PxAng/dist/px-ang/browser/index.html")
    );
  });
}

// ✅ Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(db_url);
    console.log(`Connected to the database ${db_url}`);
  } catch (err) {
    console.error("Connection error:", err);
  }
}
connect();

// ✅ Save User Endpoint
app.post("/save-user", async (req, res) => {
  const { uid } = req.body;
  console.log("Request body:", req.body);

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({ firebaseUid: uid });
      await user.save();
    }
    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Start Local Server
if (process.env.NODE_ENV !== "production") {
  app.listen(port_no, () => {
    console.log(`Server running on port ${port_no}`);
  });
}

// ✅ Export for Vercel
module.exports = app;
