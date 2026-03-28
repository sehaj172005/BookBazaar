import connectDB from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Book";
import User from "@/models/User";
import { protect } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const request = await Request.findById(id);
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    const isBuyer = request.buyer.toString() === user._id.toString();
    const isSeller = request.seller.toString() === user._id.toString();

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    if (request.status !== "accepted") {
      return NextResponse.json({ message: "Request must be accepted before completing" }, { status: 400 });
    }

    request.isCompleted = true;
    request.completedAt = new Date();
    await request.save();

    // Mark book as sold
    await Book.findByIdAndUpdate(request.book, { isSold: true });

    // Increment seller's completed deals
    await User.findByIdAndUpdate(request.seller, { $inc: { completedDeals: 1 } });

    return NextResponse.json({ message: "Deal marked as complete! 🎉", request });
  } catch (err) {
    console.error("Request Complete PUT Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
