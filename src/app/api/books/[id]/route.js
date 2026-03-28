import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import User from "@/models/User";
import { protect } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("seller", "name avatar rating verified badge completedDeals booksListed");

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (err) {
    console.error("Book Detail GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (book.seller.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    await book.deleteOne();
    await User.findByIdAndUpdate(user._id, { $inc: { booksListed: -1 } });

    return NextResponse.json({ message: "Book removed" });
  } catch (err) {
    console.error("Book DELETE Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
