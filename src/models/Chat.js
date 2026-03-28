import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Caching guard prevents OverwriteModelError on Next.js hot reload
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
