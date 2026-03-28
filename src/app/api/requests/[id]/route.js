import connectDB from "@/lib/mongodb";
import Request from "@/models/Request";
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
    const { status } = await req.json();

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status — use accepted or rejected" }, { status: 400 });
    }

    const request = await Request.findById(id);
    if (!request) return NextResponse.json({ message: "Request not found" }, { status: 404 });

    if (request.seller.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Only the seller can update this request" }, { status: 403 });
    }

    request.status = status;
    await request.save();

    const populated = await request
      .populate("book", "title images price")
      .then((r) => r.populate("buyer", "name avatar"))
      .then((r) => r.populate("seller", "name avatar"));

    return NextResponse.json(populated);
  } catch (err) {
    console.error("Request PUT Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
