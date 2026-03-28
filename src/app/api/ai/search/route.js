import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import { callGroq, groq } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ message: "Query is required" }, { status: 400 });

    await connectDB();

    const prompt = `You are a smart search assistant for a book marketplace.
User query: ${query}

Return JSON:
{
  "correctedQuery": "string",
  "suggestions": ["string", "string"],
  "categories": ["string", "string"]
}`;

    const fallback = { correctedQuery: query, suggestions: [], categories: [] };
    const aiResult = await callGroq(prompt, fallback);

    const searchTerms = aiResult.correctedQuery || query;
    const dbFilter = {
      isSold: false,
      $or: [
        { title: { $regex: searchTerms, $options: "i" } },
        { author: { $regex: searchTerms, $options: "i" } },
        { category: { $regex: searchTerms, $options: "i" } },
        { description: { $regex: searchTerms, $options: "i" } },
      ],
    };

    const books = await Book.find(dbFilter)
      .populate("seller", "name avatar rating verified badge")
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json({
      ...aiResult,
      books,
      aiGenerated: !!groq,
    });
  } catch (err) {
    console.error("AI Smart Search Error:", err);
    return NextResponse.json({ message: "Smart search failed", error: err.message }, { status: 500 });
  }
}
