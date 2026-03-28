import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import User from "@/models/User";
import { protect } from "@/lib/middleware";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configuration for Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const demand = searchParams.get("demand");
    const maxPrice = searchParams.get("maxPrice");
    const isBundle = searchParams.get("isBundle");

    let filter = { isSold: false };

    if (isBundle === "true") {
      filter.isBundle = true;
    } else if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
    }
    if (condition) filter.condition = condition;
    if (demand) filter.demand = demand;
    if (maxPrice) filter.price = { $lte: parseInt(maxPrice) };

    let books;
    if (q) {
      books = await Book.find({ ...filter, $text: { $search: q } })
        .populate("seller", "name avatar rating verified badge completedDeals")
        .sort({ createdAt: -1 });
    } else {
      books = await Book.find(filter)
        .populate("seller", "name avatar rating verified badge completedDeals")
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(books);
  } catch (err) {
    console.error("Books GET Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await protect(req);
    if (!user) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await connectDB();
    const formData = await req.formData();
    
    const title = formData.get("title");
    const author = formData.get("author");
    const price = formData.get("price");
    const mrp = formData.get("mrp");
    const condition = formData.get("condition");
    const category = formData.get("category");
    const classLevel = formData.get("classLevel");
    const description = formData.get("description");
    const location = formData.get("location");
    const isBundle = formData.get("isBundle");
    const bundleBooksStr = formData.get("bundleBooks");
    
    // Image Handling
    const files = formData.getAll("images");
    const imageUrls = [];

    for (const file of files) {
      if (typeof file !== "string") {
        // Only attempt Cloudinary upload if configured
        if (process.env.CLOUDINARY_API_KEY) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
              resource_type: 'image',
              folder: 'rebound/books'
            }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }).end(buffer);
          });
          imageUrls.push(result.secure_url);
        } else {
          console.warn("⚠️ Cloudinary not configured. Skipping image upload.");
        }
      }
    }

    const book = await Book.create({
      title,
      author,
      price: parseFloat(price),
      mrp: parseFloat(mrp),
      images: imageUrls,
      condition,
      category,
      classLevel,
      description,
      location,
      seller: user._id,
      isBundle: isBundle === "true",
      bundleBooks: bundleBooksStr ? JSON.parse(bundleBooksStr) : [],
    });

    // Increment seller's booksListed
    await User.findByIdAndUpdate(user._id, { $inc: { booksListed: 1 } });

    const populated = await book.populate("seller", "name avatar rating verified badge");
    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Books POST Error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
