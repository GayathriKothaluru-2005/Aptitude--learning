// routes/practiceRoutes.js — AI-powered practice MCQ route
const express = require("express");
const router  = express.Router();
const { generatePractice } = require("../controllers/practiceController");

// POST /api/practice
// Body: { topic: "percentages" }
router.post("/practice", generatePractice);

module.exports = router;
