// utils/progress.js
// Persists completed topics and quiz scores to localStorage.
// Consumed by Progress.jsx (read) and LearnPage/PracticePage (write).

const COMPLETED_KEY = "aptiprep_completed_topics";
const SCORES_KEY    = "aptiprep_quiz_scores";

// ── Completed Topics ─────────────────────────────────────────

/** Returns array of completed topic slugs, e.g. ["percentages", "algebra"] */
export function getCompletedTopics() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY)) || [];
  } catch {
    return [];
  }
}

/** Marks a topic slug as complete (idempotent). */
export function markTopicComplete(slug) {
  if (!slug) return;
  const completed = getCompletedTopics();
  if (!completed.includes(slug)) {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completed, slug]));
  }
}

// ── Quiz Scores ───────────────────────────────────────────────

/**
 * Returns array of score objects:
 * { topic, score, total, date, questions?, answers? }
 */
export function getQuizScores() {
  try {
    return JSON.parse(localStorage.getItem(SCORES_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Saves a quiz result.
 * @param {string}   topic     - Human-readable topic name (e.g. "Percentages")
 * @param {number}   score     - Number of correct answers
 * @param {number}   total     - Total number of questions (must be a number)
 * @param {Array}    questions - (optional) Full question objects for history detail
 * @param {Array}    answers   - (optional) User's answers array for history detail
 */
export function saveQuizScore(topic, score, total, questions = [], answers = []) {
  // Guard: total must be a real number, not an array or anything else
  const safeTotal = typeof total === "number" && !isNaN(total) ? total : 0;
  const safeScore = typeof score === "number" && !isNaN(score) ? score : 0;

  const scores = getQuizScores();
  scores.push({
    topic,
    score:     safeScore,
    total:     safeTotal,
    date:      new Date().toISOString(),
    questions: Array.isArray(questions) ? questions : [],
    answers:   Array.isArray(answers)   ? answers   : [],
  });
  localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

// ── Clear All ────────────────────────────────────────────────

/** Wipes all stored progress (used by the Reset button). */
export function clearProgress() {
  localStorage.removeItem(COMPLETED_KEY);
  localStorage.removeItem(SCORES_KEY);
}