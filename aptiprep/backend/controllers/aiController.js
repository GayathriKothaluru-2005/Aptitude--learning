// controllers/aiController.js — Groq API integration
// Quiz generation uses a DEDICATED API key: GROQ_API_KEY_QUIZ
// Legacy /api/generate uses the shared GROQ_API_KEY

const Groq = require("groq-sdk");

// ── Two separate Groq clients ─────────────────────────────────────────────────
// Shared key — used by /api/generate (learn content, legacy calls)
const groqShared = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Quiz-only key — used exclusively by /api/quiz
// Falls back to the shared key if GROQ_API_KEY_QUIZ is not set
const groqQuiz = new Groq({
  apiKey: process.env.GROQ_API_KEY_QUIZ || process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY_QUIZ) {
  console.warn(
    "[aiController] ⚠️  GROQ_API_KEY_QUIZ not set — quiz is sharing GROQ_API_KEY. " +
    "Set GROQ_API_KEY_QUIZ in your .env to use a dedicated key."
  );
} else {
  console.log("[aiController] ✅ Quiz using dedicated GROQ_API_KEY_QUIZ");
}

// ── Generic Groq caller ───────────────────────────────────────────────────────
async function callGroq(client, systemPrompt, userPrompt, maxTokens = 2048) {
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens:  maxTokens,
  });

  const raw     = completion.choices[0]?.message?.content || "";
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned non-JSON response: " + raw.slice(0, 200));
  }
}

// ── POST /api/generate (shared key) ──────────────────────────────────────────
const generateTopicContent = async (req, res) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ error: "topic field is required" });
  }

  const systemPrompt = `You are an expert aptitude tutor.
Always respond with ONLY valid JSON — no markdown, no explanation outside JSON.
Schema: { "explanation": "string", "formulas": [], "shortcuts": [], "questions": [{ "id": number, "question": "string", "options": [], "answer": "A"|"B"|"C"|"D", "explanation": "string" }] }`;

  const userPrompt = `Generate aptitude learning content for the topic: "${topic}"`;

  try {
    const data = await callGroq(groqShared, systemPrompt, userPrompt);
    return res.json({ success: true, topic, data });
  } catch (err) {
    console.error("[generateTopicContent]", err.message);
    return res.status(500).json({ error: "Failed to generate content", details: err.message });
  }
};

// ── POST /api/quiz (dedicated quiz key) ──────────────────────────────────────
const generateQuiz = async (req, res) => {
  const { topic, count = 10 } = req.body;
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const systemPrompt = `You are an expert aptitude exam setter.
Respond ONLY with valid JSON — no markdown, no preamble, no trailing text.
Schema:
{
  "questions": [
    {
      "id": number,
      "question": "string",
      "options": ["A. text", "B. text", "C. text", "D. text"],
      "answer": "A"|"B"|"C"|"D",
      "explanation": "string — concise 1-2 sentence explanation of the correct answer"
    }
  ]
}
RULES:
- Include exactly ${count} questions
- Vary difficulty: mix easy, medium, and hard
- options array must have exactly 4 items, each prefixed with "A. ", "B. ", "C. ", "D. "
- explanation is REQUIRED for every question`;

  const userPrompt = `Create ${count} MCQ aptitude questions on: "${topic}". Vary difficulty across easy, medium, and hard.`;

  // Scale token budget: ~350 tokens per question + 300 overhead
  const maxTokens = Math.min(count * 350 + 300, 8000);

  try {
    const data = await callGroq(groqQuiz, systemPrompt, userPrompt, maxTokens);

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("AI returned no questions");
    }

    return res.json({ success: true, topic, questions: data.questions });
  } catch (err) {
    console.error("[generateQuiz]", err.message);
    return res.status(500).json({ error: "Failed to generate quiz", details: err.message });
  }
};

module.exports = { generateTopicContent, generateQuiz };