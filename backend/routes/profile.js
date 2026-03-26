const express = require("express");
const User = require("../models/User");
const Book = require("../models/Book");
const Request = require("../models/Request");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @route  GET /profile/me
// @desc   Get logged-in user's profile
// @access Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    const myBooks = await Book.find({ seller: req.user._id }).sort({ createdAt: -1 });
    const requestsSent = await Request.find({ buyer: req.user._id })
      .populate("book", "title images price condition")
      .populate("seller", "name avatar")
      .sort({ createdAt: -1 });
    const requestsReceived = await Request.find({ seller: req.user._id })
      .populate("book", "title images price condition")
      .populate("buyer", "name avatar email")
      .sort({ createdAt: -1 });

    res.json({ user, myBooks, requestsSent, requestsReceived });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  PUT /profile/me
// @desc   Update user profile
// @access Private
router.put("/me", protect, async (req, res) => {
  try {
    const { name, location, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name !== undefined) user.name = name.trim();
    if (location !== undefined) user.location = location.trim();
    if (bio !== undefined) user.bio = bio.trim();
    await user.save();
    const updated = await User.findById(user._id).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
