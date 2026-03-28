import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    const books = await Book.find({ seller: userId })
      .populate("seller", "name avatar rating")
      .sort({ createdAt: -1 });

    return NextResponse.json(books);
  } catch (err) {
    console.error("User Books GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
