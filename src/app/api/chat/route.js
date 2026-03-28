import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Request from "@/models/Request";
import { protect } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const userId = user._id;

    // All requests where user is buyer or seller (accepted OR has initial message)
    const requests = await Request.find({
      $and: [
        { $or: [{ buyer: userId }, { seller: userId }] },
        {
          $or: [
            { status: "accepted" },
            { status: "pending", hasInitialMessage: true },
          ],
        },
      ],
    })
      .populate("book", "title images price")
      .populate("buyer", "name avatar")
      .populate("seller", "name avatar")
      .sort({ updatedAt: -1 });

    // Attach last message to each
    const result = await Promise.all(
      requests.map(async (r) => {
        const lastChat = await Chat.findOne({ request: r._id })
          .sort({ createdAt: -1 })
          .select("message createdAt");
        return {
          ...r.toObject(),
          lastMessage: lastChat?.message || null,
          lastMessageAt: lastChat?.createdAt || null,
        };
      })
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Chat GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
