const express = require("express");
const Request = require("../models/Request");
const Book = require("../models/Book");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @route  POST /requests
// @desc   Send a request for a book
// @access Private
router.post("/", protect, async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.isSold) return res.status(400).json({ message: "Book already sold" });

    // Prevent requesting own book
    if (book.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot request your own book" });
    }

    // Check for duplicate request
    const existing = await Request.findOne({ book: bookId, buyer: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already sent a request for this book", request: existing });
    }

    const request = await Request.create({
      book: bookId,
      buyer: req.user._id,
      seller: book.seller,
    });

    // Increment book requests count
    await Book.findByIdAndUpdate(bookId, { $inc: { requests: 1 } });

    const populated = await request
      .populate("book", "title images price condition")
      .then((r) => r.populate("buyer", "name avatar rating"))
      .then((r) => r.populate("seller", "name avatar rating"));

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  GET /requests/sent
// @desc   Get all requests sent by the logged-in buyer
// @access Private
router.get("/sent", protect, async (req, res) => {
  try {
    const requests = await Request.find({ buyer: req.user._id })
      .populate("book", "title images price condition category seller")
      .populate("seller", "name avatar rating")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  GET /requests/received
// @desc   Get all requests received by the logged-in seller
// @access Private
router.get("/received", protect, async (req, res) => {
  try {
    const requests = await Request.find({ seller: req.user._id })
      .populate("book", "title images price condition category")
      .populate("buyer", "name avatar rating email")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  PUT /requests/:id
// @desc   Accept or reject a request (seller only)
// @access Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status — use accepted or rejected" });
    }

    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the seller can update this request" });
    }

    request.status = status;
    await request.save();

    const populated = await request
      .populate("book", "title images price")
      .then((r) => r.populate("buyer", "name avatar"))
      .then((r) => r.populate("seller", "name avatar"));

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  PUT /requests/:id/complete
// @desc   Mark deal as complete (buyer or seller)
// @access Private
router.put("/:id/complete", protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const isBuyer = request.buyer.toString() === req.user._id.toString();
    const isSeller = request.seller.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ message: "Request must be accepted before completing" });
    }

    request.isCompleted = true;
    request.completedAt = new Date();
    await request.save();

    // Mark book as sold
    await Book.findByIdAndUpdate(request.book, { isSold: true });

    // Increment seller's completed deals
    await User.findByIdAndUpdate(request.seller, { $inc: { completedDeals: 1 } });

    res.json({ message: "Deal marked as complete! 🎉", request });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
