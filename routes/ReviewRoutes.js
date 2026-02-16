const express = require("express");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

// ✅ Add a review for a specific product
router.post("/add/:productId", reviewController.addReview);

router.get("/fetch/:productId", reviewController.getReviews);
router.delete("/delete/:id", reviewController.deleteReview);

module.exports = router;
