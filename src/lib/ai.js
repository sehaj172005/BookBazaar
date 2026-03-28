import Groq from "groq-sdk";
import axios from "axios";

// Initialize Groq client
const rawKey = process.env.GROQ_API_KEY;
export const groq = rawKey && rawKey.trim() !== "" && !rawKey.includes("your_groq_api_key")
  ? new Groq({ apiKey: rawKey.trim() })
  : null;

/**
 * Safely parse JSON from LLM response — strips markdown code fences if present
 */
export function safeParseJSON(text) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json\n?/gi, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
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
export async function callHuggingFace(prompt, base64Image = null) {
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
export async function callGroq(prompt, fallback = null) {
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
