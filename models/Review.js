const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
       
    },
    name: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing spaces from the name
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing spaces from the comment
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
