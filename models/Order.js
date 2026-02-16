const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  cart: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Order", orderSchema);

