const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    hasInitialMessage: { type: Boolean, default: false },
    sellerReplied: { type: Boolean, default: false },

  },
  { timestamps: true }
);

// Prevent duplicate requests from same buyer for same book
requestSchema.index({ book: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model("Request", requestSchema);
