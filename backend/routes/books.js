const express = require("express");
const multer = require("multer");
const path = require("path");
const Book = require("../models/Book");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `book-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

// @route  GET /books
// @desc   Get all books (with optional search + category filter)
// @access Public
router.get("/", async (req, res) => {
  try {
    const { q, category, condition, demand, maxPrice, isBundle } = req.query;

    let filter = { isSold: false };

    if (isBundle === "true") {
      filter.isBundle = true;
    } else if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (condition) filter.condition = condition;
    if (demand) filter.demand = demand;
    if (maxPrice) filter.price = { $lte: parseInt(maxPrice) };

    let books;
    if (q) {
      books = await Book.find({ ...filter, $text: { $search: q } })
        .populate("seller", "name avatar rating verified badge completedDeals")
        .sort({ createdAt: -1 });
    } else {
      books = await Book.find(filter)
        .populate("seller", "name avatar rating verified badge completedDeals")
        .sort({ createdAt: -1 });
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  GET /books/user/:userId
// @desc   Get books by a specific seller
// @access Public
router.get("/user/:userId", async (req, res) => {
  try {
    const books = await Book.find({ seller: req.params.userId })
      .populate("seller", "name avatar rating")
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  GET /books/:id
// @desc   Get single book + increment views
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("seller", "name avatar rating verified badge completedDeals booksListed");

    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  POST /books
// @desc   Create book listing
// @access Private
router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    const { title, author, price, mrp, condition, category, classLevel, description, location, isBundle, bundleBooks } = req.body;

    if (!title || !price || !mrp || !condition || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Build image URLs
    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const book = await Book.create({
      title,
      author,
      price: parseFloat(price),
      mrp: parseFloat(mrp),
      images,
      condition,
      category,
      classLevel,
      description,
      location,
      seller: req.user._id,
      isBundle: isBundle === "true",
      bundleBooks: bundleBooks ? JSON.parse(bundleBooks) : [],
    });

    // Increment seller's booksListed
    await User.findByIdAndUpdate(req.user._id, { $inc: { booksListed: 1 } });

    const populated = await book.populate("seller", "name avatar rating verified badge");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  DELETE /books/:id
// @desc   Delete a book (owner only)
// @access Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await book.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $inc: { booksListed: -1 } });

    res.json({ message: "Book removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;

