const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Review = require("../models/Review");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware

// ✅ Upload Image & Add Product
router.post("/add", async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // ✅ Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: "All fields including image URL are required" });
    }

    // ✅ Save product to MongoDB
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image, // Using direct URL
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Products (with optional search and filters)
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive name match
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// routes/productRoutes.js
router.get("/search", async (req, res) => {
  const query = req.query.query?.trim() || "";

  try {
    const results = await Product.find({
      name: { $regex: query, $options: "i" }, // case-insensitive search
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
});

// ✅ Get a Single Product by ID
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
