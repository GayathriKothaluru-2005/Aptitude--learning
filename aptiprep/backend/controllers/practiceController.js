// controllers/practiceController.js
// Generates 5 MCQ practice questions via Groq AI.
// Fixes: max_tokens raised to 1500, real errors exposed, robust JSON extraction.

const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── In-memory cache ──────────────────────────────────────────
const practiceCache = new Map();

// ── Prompt ───────────────────────────────────────────────────
const buildPrompt = (topic) =>
  `Generate exactly 5 multiple-choice aptitude questions on: "${topic}".

Respond with ONLY a valid JSON object. No markdown. No text outside JSON.

Schema:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correctAnswer": "A",
      "explanation": "One sentence why this answer is correct."
    }
  ]
}

Rules:
- Exactly 5 questions, 4 options each
- correctAnswer must be exactly one of: A B C D
- Keep explanations to 1 sentence
- Output ONLY the JSON object, nothing else`;

// ── Extract JSON from response robustly ──────────────────────
// Handles: plain JSON, ```json ... ```, extra text before/after
function extractJSON(raw) {
  // 1. Strip markdown fences
  let cleaned = raw
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();

  // 2. Try direct parse first
  try { return JSON.parse(cleaned); } catch (_) {}

  // 3. Find the first { ... } block and try parsing that
  const start = cleaned.indexOf("{");
  const end   = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try { return JSON.parse(cleaned.slice(start, end + 1)); } catch (_) {}
  }

  // 4. Give up — throw with raw snippet for debugging
  throw new Error(
    `Cannot parse AI response as JSON. First 300 chars: ${raw.slice(0, 300)}`
  );
}

// ── POST /api/practice ───────────────────────────────────────
const generatePractice = async (req, res) => {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({
      success: false,
      error: "topic is required.",
    });
  }

  const key = topic.trim().toLowerCase();

  // Cache hit
  if (practiceCache.has(key)) {
    console.log(`[Practice] Cache HIT → "${topic}"`);
    return res.json({ success: true, cached: true, topic, questions: practiceCache.get(key) });
  }

  console.log(`[Practice] Cache MISS → calling Groq for "${topic}"`);

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an aptitude exam setter. Output ONLY valid JSON. No markdown. No extra text.",
        },
        {
          role: "user",
          content: buildPrompt(topic.trim()),
        },
      ],
      temperature: 0.5,
      max_tokens: 1500,   // FIX: was 800 — too low, caused truncated JSON
    });

    const raw = completion.choices[0]?.message?.content || "";
    console.log(`[Practice] Raw response length: ${raw.length} chars`);

    // Parse — throws with details if it fails
    const parsed = extractJSON(raw);

    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return res.status(500).json({
        success: false,
        error: "AI response has no questions. Please try again.",
      });
    }

    // Validate each question has required fields
    const valid = parsed.questions.every(
      (q) => q.question && q.options && q.correctAnswer && q.explanation
    );
    if (!valid) {
      return res.status(500).json({
        success: false,
        error: "AI returned incomplete questions. Please try again.",
      });
    }

    practiceCache.set(key, parsed.questions);

    return res.json({
      success: true,
      cached: false,
      topic,
      questions: parsed.questions,
    });

  } catch (err) {
    // FIX: Log AND return the actual error message — no more vague responses
    console.error("[Practice] Error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message.includes("API")
        ? "Groq API error — check your GROQ_API_KEY in .env"
        : err.message.includes("JSON")
        ? "AI returned malformed response. Try again."
        : "Failed to generate questions. Please try again.",
      details: err.message,
    });
  }
};

module.exports = { generatePractice };
