const express = require("express");
const Groq = require("groq-sdk");
const axios = require("axios");
const Book = require("../models/Book");
const router = express.Router();

// Initialize Groq client only if key is set and not a placeholder
const rawKey = process.env.GROQ_API_KEY;
const groq = rawKey && rawKey.trim() !== "" && !rawKey.includes("your_groq_api_key")
  ? new Groq({ apiKey: rawKey.trim() })
  : null;

/**
 * Safely parse JSON from LLM response — strips markdown code fences if present
 */
function safeParseJSON(text) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Try to find JSON block
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        return JSON.parse(text.substring(start, end + 1));
      }
    } catch {}
    return null;
  }
}

/**
 * Helper to call Hugging Face Inference API
 */
async function callHuggingFace(prompt, base64Image = null) {
  const hfToken = process.env.HF_API_KEY;
  if (!hfToken || hfToken.includes("your_huggingface_token")) {
    console.warn("[AI] HF_API_KEY not configured");
    return null;
  }

  try {
    const model = "google/gemma-3-4b-it";
    const url = `https://api-inference.huggingface.co/models/${model}`;

    let payload;
    if (base64Image) {
      payload = {
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: base64Image.startsWith("data:") ? base64Image : `data:image/jpeg;base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 500
      };
    } else {
      payload = {
        inputs: prompt,
        parameters: { max_new_tokens: 500 }
      };
    }

    const response = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${hfToken}`, "Content-Type": "application/json" }
    });

    let text = "";
    if (Array.isArray(response.data)) {
      text = response.data[0]?.generated_text || response.data[0]?.choices?.[0]?.message?.content || "";
    } else {
      text = response.data.choices?.[0]?.message?.content || response.data.generated_text || "";
    }
    
    return text.trim();
  } catch (err) {
    console.error("[HF ERROR]", err.response?.data || err.message);
    return null;
  }
}

/**
 * Helper to call Groq with Llama 3.3
 */
async function callGroq(prompt, fallback = null) {
  if (!groq) return fallback;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || "";
    return safeParseJSON(text) || fallback;
  } catch (err) {
    console.error("[GROQ ERROR]", err.message);
    return fallback;
  }
}

/**
 * FEATURE 1: AI Condition Detection (Hugging Face)
 */
router.post("/detect-condition", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ message: "Image data is required" });

    const prompt = `You are analyzing a second-hand book image. Determine:
1. condition (one of: like_new, good, poor)
2. list of visible issues (marks, torn pages, damage)

Return JSON format: {"condition": "string", "issues": ["string", "string"]}`;

    const text = await callHuggingFace(prompt, image);
    const parsed = safeParseJSON(text) || { condition: "good", issues: ["Could not verify automatically"] };

    res.json(parsed);
  } catch (err) {
    console.error("[DETECT CONDITION ERROR]", err);
    res.status(500).json({ message: "Condition detection failed", error: err.message });
  }
});

/**
 * FEATURE 2: AI Price Suggestion (Groq)
 */
async function handlePriceSuggestion(req, res) {
  try {
    const { title, mrp, condition, category, demandScore = 50 } = req.body;

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
    res.json({ ...result, aiGenerated: !!groq });
  } catch (err) {
    console.error("[PRICE SUGGESTION ERROR]", err);
    res.status(500).json({ message: "AI price suggestion failed", error: err.message });
  }
}

router.post("/price", handlePriceSuggestion);
router.post("/price-suggestion", handlePriceSuggestion);

/**
 * FEATURE 3: SMART SEARCH (AI ENHANCED)
 */
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query is required" });

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

    res.json({
      ...aiResult,
      books,
      aiGenerated: !!groq,
    });
  } catch (err) {
    console.error("[SMART SEARCH ERROR]", err);
    res.status(500).json({ message: "Smart search failed", error: err.message });
  }
});

module.exports = router;
