// controllers/learnController.js
// Serves static topic content from topicsData.json.
// NO AI calls — instant response, zero token usage.

const topicsData = require("../data/topicsData.json");

// Build a lookup map once on startup: { "percentages": {...}, ... }
const topicMap = {};
topicsData.forEach((topic) => {
  topicMap[topic.slug] = topic;
});

// ── GET /api/learn/:slug ────────────────────────────────────
// Returns full static content for one topic.
const getLearnContent = (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ success: false, error: "Topic slug is required." });
  }

  const topic = topicMap[slug.toLowerCase()];

  if (!topic) {
    return res.status(404).json({
      success: false,
      error: `Topic "${slug}" not found.`,
      available: Object.keys(topicMap),
    });
  }

  return res.json({ success: true, data: topic });
};

// ── GET /api/learn ──────────────────────────────────────────
// Returns a list of all topics (name + slug + category only).
const getAllTopics = (_req, res) => {
  const list = topicsData.map(({ slug, name, category }) => ({ slug, name, category }));
  return res.json({ success: true, topics: list });
};

module.exports = { getLearnContent, getAllTopics };
