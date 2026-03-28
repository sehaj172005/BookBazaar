import connectDB from "@/lib/mongodb";
import Request from "@/models/Request";
import Book from "@/models/Book";
import { protect } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { bookId } = await req.json();

    const book = await Book.findById(bookId);
    if (!book) return NextResponse.json({ message: "Book not found" }, { status: 404 });
    if (book.isSold) return NextResponse.json({ message: "Book already sold" }, { status: 400 });

    if (book.seller.toString() === user._id.toString()) {
      return NextResponse.json({ message: "You cannot request your own book" }, { status: 400 });
    }

    const existing = await Request.findOne({ book: bookId, buyer: user._id });
    if (existing) {
      return NextResponse.json({ message: "You already sent a request for this book", request: existing }, { status: 400 });
    }

    const request = await Request.create({
      book: bookId,
      buyer: user._id,
      seller: book.seller,
    });

    await Book.findByIdAndUpdate(bookId, { $inc: { requests: 1 } });

    const populated = await request
      .populate("book", "title images price condition")
      .then((r) => r.populate("buyer", "name avatar rating"))
      .then((r) => r.populate("seller", "name avatar rating"));

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Request POST Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
