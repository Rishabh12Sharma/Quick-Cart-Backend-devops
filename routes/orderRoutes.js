const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// Save a new order
router.post("/place", async (req, res) => {
  const { userId, cart, paymentMethod } = req.body;

  console.log("📦 Incoming Order Data:", req.body); // Log incoming request data

  if (!userId || !cart || cart.length === 0) {
    console.log("⚠️ Missing userId or cart data");
    return res.status(400).json({ message: "Missing user/cart data" });
  }

  try {
    const newOrder = new Order({ userId, cart, paymentMethod });
    console.log("📝 Saving order to database:", newOrder); // Log order being saved

    await newOrder.save();

    console.log("✅ Order saved successfully!");
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders by userId
router.get("/user/:userId", async (req, res) => {
  try {
    console.log("🔍 Fetching orders for user:", req.params.userId);
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
