import connectDB from "@/lib/mongodb";
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
    const requests = await Request.find({ buyer: user._id })
      .populate("book", "title images price condition category seller")
      .populate("seller", "name avatar rating")
      .sort({ createdAt: -1 });

    return NextResponse.json(requests);
  } catch (err) {
    console.error("Requests Sent GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
