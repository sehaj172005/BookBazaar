const express = require("express");
const Chat = require("../models/Chat");
const Request = require("../models/Request");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @route  GET /chat
// @desc   Get all active chat rooms (accepted requests + any with messages)
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // All requests where user is buyer or seller (accepted OR has initial message)
    const requests = await Request.find({
      $or: [{ buyer: userId }, { seller: userId }],
      $or: [
        { status: "accepted" },
        { status: "pending", hasInitialMessage: true },
      ],
    })
      .populate("book", "title images price")
      .populate("buyer", "name avatar")
      .populate("seller", "name avatar")
      .sort({ updatedAt: -1 });

    // Attach last message to each
    const result = await Promise.all(
      requests.map(async (req) => {
        const lastChat = await Chat.findOne({ request: req._id })
          .sort({ createdAt: -1 })
          .select("message createdAt");
        return {
          ...req.toObject(),
          lastMessage: lastChat?.message || null,
          lastMessageAt: lastChat?.createdAt || null,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  POST /chat/send
// @desc   Send a message
//   - If request is accepted: always allowed for buyer & seller
//   - If request is pending: buyer can send ONE initial message; subsequent messages blocked
// @access Private
router.post("/send", protect, async (req, res) => {
  try {
    const { requestId, message } = req.body;

    if (!requestId || !message?.trim()) {
      return res.status(400).json({ message: "requestId and message are required" });
    }

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const isBuyer = request.buyer.toString() === req.user._id.toString();
    const isSeller = request.seller.toString() === req.user._id.toString();
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Not authorized for this chat" });
    }

    if (request.status === "accepted" || request.isCompleted) {
      // Full chat allowed
    } else if (request.status === "pending" && isBuyer) {
      if (!request.sellerReplied) {
        // Allow only if no previous messages exist from buyer
        const existingCount = await Chat.countDocuments({
          request: requestId,
          sender: req.user._id,
        });
        if (existingCount > 0) {
          return res.status(403).json({
            message: "Waiting for seller to reply before you can send more messages",
            locked: true,
          });
        }
      }
      // Mark that this request now has an initial message
      await Request.findByIdAndUpdate(requestId, { hasInitialMessage: true });
    } else if (request.status === "pending" && isSeller) {
      // Seller reply unlocks the chat — mark request to track this
      await Request.findByIdAndUpdate(requestId, { sellerReplied: true });
    } else {
      return res.status(403).json({ message: "Chat not available for this request status" });
    }

    const chat = await Chat.create({
      request: requestId,
      sender: req.user._id,
      message: message.trim(),
    });

    const populated = await chat.populate("sender", "name avatar");

    // Broadcast the new message in real-time
    const io = req.app.get("io");
    if (io) {
      io.to(requestId).emit("receive_message", populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route  GET /chat/:requestId
// @desc   Get all messages for a request (both parties, any status)
// @access Private
router.get("/:requestId", protect, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const isBuyer = request.buyer.toString() === req.user._id.toString();
    const isSeller = request.seller.toString() === req.user._id.toString();
    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const messages = await Chat.find({ request: req.params.requestId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 }); // oldest first

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
