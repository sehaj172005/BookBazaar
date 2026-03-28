import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Book from "@/models/Book";
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
    
    // Detailed profile view with associated data
    const myBooks = await Book.find({ seller: user._id }).sort({ createdAt: -1 });
    const requestsSent = await Request.find({ buyer: user._id })
      .populate("book", "title images price condition")
      .populate("seller", "name avatar")
      .sort({ createdAt: -1 });
    const requestsReceived = await Request.find({ seller: user._id })
      .populate("book", "title images price condition")
      .populate("buyer", "name avatar email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ user, myBooks, requestsSent, requestsReceived });
  } catch (err) {
    console.error("Profile GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const { name, location, bio } = await req.json();

    const userToUpdate = await User.findById(user._id);
    if (!userToUpdate) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (name !== undefined) userToUpdate.name = name.trim();
    if (location !== undefined) userToUpdate.location = location.trim();
    if (bio !== undefined) userToUpdate.bio = bio.trim();

    await userToUpdate.save();
    const updated = await User.findById(user._id).select("-password");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Profile PUT Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
