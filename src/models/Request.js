import mongoose from "mongoose";

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

requestSchema.index({ book: 1, buyer: 1 }, { unique: true });

// Caching guard prevents OverwriteModelError on Next.js hot reload
export default mongoose.models.Request || mongoose.model("Request", requestSchema);
