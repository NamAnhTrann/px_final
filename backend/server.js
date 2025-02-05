const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const User = require("./model/userSchema");

const productRouter = require("./router/productRouter");
const orderRouter = require("./router/orderRouter");
const userRouter = require("./router/userRouter");
const paymentRouter = require("./router/paymentRouter");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:4200", // For local development
  "https://phucxanh.onrender.com", // Your deployed frontend
];

app.use(
  cors({
    origin: "*", // Allow all origins
    methods: "GET,POST,PUT,DELETE",
    credential: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(productRouter);
app.use(userRouter);
app.use(orderRouter);
app.use(paymentRouter);

// app.use(
//   express.static(path.join(__dirname, "../frontend/PxAng/dist/px-ang/browser"))
// );

const db_url = process.env.DB_URL;
const port_no = process.env.PORT_NO;

app.listen(port_no, function (err) {
  if (!err) {
    console.log(`connected to ${port_no}`);
  } else {
    console.log("Error occured", err);
  }
});

async function connect() {
  try {
    await mongoose.connect(db_url);
    console.log(`Conneted to the database ${db_url}`);
  } catch (err) {
    console.error("connection error");
  }
}
connect();

app.get("/", (req, res) => {
  res.send("✅ Backend is Running!");
});

app.post("/api/save-user", async (req, res) => {
  const { uid, email } = req.body;
  console.log("📥 Received request:", req.body); // ✅ Log received data

  if (!uid) {
    console.error("❌ Missing UID in request");
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = new User({
        firebaseUid: uid,
        userEmail: email || "",
      });
      await user.save();
      console.log("✅ New user created:", user);
    } else {
      if (!user.userEmail || (email && user.userEmail !== email)) {
        console.log("🔄 Updating user email:", email);
        user.userEmail = email;
        await user.save();
      }
    }

    res.status(200).json({ message: "✅ User saved successfully", user });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/PxAng/dist/px-ang/browser/index.html")
  );
});
