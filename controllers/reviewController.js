const Review = require("../models/Review");
const Product = require("../models/Product");

const addReview = async (req, res) => {
  try {
    console.log("✅ Incoming review data:", req.body);
    console.log("✅ Product ID from params:", req.params.productId);

    const { rating, comment, name, userId } = req.body;
    const productId = req.params.productId; // Get productId from URL params

    // Check if all fields are provided
    if (!name || !productId || !rating || !comment || !userId) {
      console.log("❌ Missing fields in review");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new review and save it
    console.log("✅ Creating new review...");
    const newReview = new Review({
      userId,
      name,
      productId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    console.log("✅ Review saved:", savedReview);

    // Now, find the product and update its reviews array with the new review
    console.log("✅ Looking for product with ID:", productId);
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log("❌ Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // Push the new review to the product's reviews array
    console.log("✅ Pushing review to product's reviews array");
    product.reviews.push(savedReview._id);

    // Save the updated product
    await product.save();
    console.log("✅ Product updated with new review");

    // Respond with the saved review
    res.status(200).json(savedReview);
  } catch (error) {
    console.error("❌ Error while adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReviews = async (req, res) => {
  try {
    console.log("✅ Fetching reviews for product ID:", req.params.productId);

    const { productId } = req.params;

    // Validate productId
    if (!productId) {
      console.log("❌ No productId provided in URL params");
      return res.status(400).json({ message: "Product ID is required" });
    }

    console.log("✅ Searching reviews in database...");
    const reviews = await Review.find({ productId: productId });

    if (reviews.length === 0) {
      console.log("⚠️ No reviews found for this product");
    } else {
      console.log(`✅ Found ${reviews.length} reviews`);
    }

    // Respond with reviews
    res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Error while fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if review exists
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Remove the review from the product's reviews array
    await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id }
    });

    await Review.findByIdAndDelete(id);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("❌ Error while deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = { addReview, getReviews, deleteReview };
