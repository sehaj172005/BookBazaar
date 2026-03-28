import { callHuggingFace, safeParseJSON } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ message: "Image data is required" }, { status: 400 });

    const prompt = `You are analyzing a second-hand book image. Determine:
1. condition (one of: like_new, good, poor)
2. list of visible issues (marks, torn pages, damage)

Return JSON format: {"condition": "string", "issues": ["string", "string"]}`;

    const text = await callHuggingFace(prompt, image);
    const parsed = safeParseJSON(text) || { condition: "good", issues: ["Could not verify automatically"] };

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("AI Detect Condition Error:", err);
    return NextResponse.json({ message: "Condition detection failed", error: err.message }, { status: 500 });
  }
}
