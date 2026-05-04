// hooks/useAI.js
import { useState, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTopicContent = useCallback(async (topic) => {
    setLoading(true);
    setError(null);
    try {
      const slug = topic.trim().toLowerCase().replace(/\s+/g, "-");
      const res = await fetch(`${API_BASE}/topic/${slug}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Unknown error");
      return json.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateQuiz = useCallback(async (topic, difficulty = "medium") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/generate-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // if a number was passed (old code), default to "medium"
        body: JSON.stringify({
          topic,
          difficulty: typeof difficulty === "number" ? "medium" : difficulty,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();

      // Normalize options to old "A) text" format so Quiz.jsx works unchanged
      const normalized = json.questions.map((q, i) => ({
        id: i,
        question: q.question,
        options: q.options.map((opt, idx) => {
          const letter = ["A", "B", "C", "D"][idx];
          // If Gemini already prefixed "A) ...", don't double-prefix
          return opt.startsWith(`${letter})`) ? opt : `${letter}) ${opt}`;
        }),
        // Normalize answer to single letter "A"/"B"/"C"/"D"
        answer: normalizeAnswer(q.answer, q.options),
      }));

      return normalized;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateTopicContent, generateQuiz, loading, error };
}

// Helper — converts answer text to a letter
// Gemini returns full option text as answer, Quiz.jsx expects "A"/"B"/"C"/"D"
function normalizeAnswer(answer, options) {
  const letters = ["A", "B", "C", "D"];

  // Already a single letter
  if (letters.includes(answer?.trim().toUpperCase())) {
    return answer.trim().toUpperCase();
  }

  // Match answer text against options
  const idx = options.findIndex(
    (opt) => opt.trim().toLowerCase() === answer?.trim().toLowerCase()
  );
  return idx >= 0 ? letters[idx] : "A";
}