import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Request from "@/models/Request";
import { protect } from "@/lib/middleware";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { requestId, message } = await req.json();

    if (!requestId || !message?.trim()) {
      return NextResponse.json({ message: "requestId and message are required" }, { status: 400 });
    }

    const requestToUpdate = await Request.findById(requestId);
    if (!requestToUpdate) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    const isBuyer = requestToUpdate.buyer.toString() === user._id.toString();
    const isSeller = requestToUpdate.seller.toString() === user._id.toString();
    if (!isBuyer && !isSeller) {
      return NextResponse.json({ message: "Not authorized for this chat" }, { status: 403 });
    }

    // Logic for pending chats
    if (requestToUpdate.status === "accepted" || requestToUpdate.isCompleted) {
      // Full chat allowed
    } else if (requestToUpdate.status === "pending" && isBuyer) {
      if (!requestToUpdate.sellerReplied) {
        const existingCount = await Chat.countDocuments({
          request: requestId,
          sender: user._id,
        });
        if (existingCount > 0) {
          return NextResponse.json({
            message: "Waiting for seller to reply before you can send more messages",
            locked: true,
          }, { status: 403 });
        }
      }
      await Request.findByIdAndUpdate(requestId, { hasInitialMessage: true });
    } else if (requestToUpdate.status === "pending" && isSeller) {
      await Request.findByIdAndUpdate(requestId, { sellerReplied: true });
    } else {
      return NextResponse.json({ message: "Chat not available for this request status" }, { status: 403 });
    }

    const chat = await Chat.create({
      request: requestId,
      sender: user._id,
      message: message.trim(),
    });

    const populated = await chat.populate("sender", "name avatar");

    // Replace Socket.io with Pusher Trigger
    try {
      if (process.env.NEXT_PUBLIC_PUSHER_KEY) {
        await pusherServer.trigger(requestId, "receive_message", populated);
        console.log(`✅ Pusher triggered for channel: ${requestId}`);
      }
    } catch (pusherErr) {
      console.warn("⚠️ Pusher trigger failed, but message was saved:", pusherErr.message);
    }

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Chat Send Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
