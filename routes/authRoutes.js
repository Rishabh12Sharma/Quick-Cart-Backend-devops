const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// ==================== SIGNUP ====================
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token, msg: "Signup successful" });
    } catch (err) {
      console.error("Signup error:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// ==================== LOGIN ====================
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log("Login attempt:", email);

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token, msg: "Login successful" });
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).send("Server Error");
    }
  }
);

// ==================== PROTECTED PROFILE ====================
router.get("/profile", async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

module.exports = router;