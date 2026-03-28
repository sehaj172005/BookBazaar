import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Request from "@/models/Request";
import { protect } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { requestId } = await params;

    const currentRequest = await Request.findById(requestId);
    if (!currentRequest) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    const isBuyer = currentRequest.buyer.toString() === user._id.toString();
    const isSeller = currentRequest.seller.toString() === user._id.toString();

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const messages = await Chat.find({ request: requestId })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 }); // oldest first

    return NextResponse.json(messages);
  } catch (err) {
    console.error("Chat Messages GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
