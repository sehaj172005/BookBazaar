import { callGroq, groq } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, mrp, condition, category, demandScore = 50 } = await req.json();

    const fallback = {
      minPrice: Math.round(mrp * 0.3),
      maxPrice: Math.round(mrp * 0.6),
      bestPrice: Math.round(mrp * 0.45),
      reason: "Based on typical 2nd-hand market rates for this condition."
    };

    const prompt = `You are an expert marketplace pricing assistant.
Book: ${title}
MRP: ${mrp}
Condition: ${condition}
Category: ${category}
Demand: ${demandScore}

Suggest:
- min price
- max price
- best price to sell fast
- short reason

Return ONLY JSON:
{
  "minPrice": number,
  "maxPrice": number,
  "bestPrice": number,
  "reason": "string"
}`;

    const result = await callGroq(prompt, fallback);
    return NextResponse.json({ ...result, aiGenerated: !!groq });
  } catch (err) {
    console.error("AI Price Suggestion Error:", err);
    return NextResponse.json({ message: "AI price suggestion failed", error: err.message }, { status: 500 });
  }
}
