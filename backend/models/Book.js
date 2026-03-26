const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, trim: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    images: [{ type: String }], // URLs/paths
    condition: { type: String, enum: ["Like New", "Good", "Poor"], required: true },
    demand: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    category: {
      type: String,
      enum: ["JEE", "NEET", "CBSE Boards", "University", "Others", "Bundles"],
      required: true,
    },
    classLevel: { type: String, trim: true },
    description: { type: String, trim: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, trim: true },
    distance: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    requests: { type: Number, default: 0 },
    isSold: { type: Boolean, default: false },
    isBundle: { type: Boolean, default: false },
    bundleBooks: [{ title: String, subject: String, mrp: Number }],
  },
  { timestamps: true }
);

// Full-text search index
bookSchema.index({ title: "text", author: "text", category: "text" });

module.exports = mongoose.model("Book", bookSchema);
