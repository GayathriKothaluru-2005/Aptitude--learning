const express = require("express");
const router = express.Router();
const { generateTopicContent, generateQuiz } = require("../controllers/aiController");

router.post("/generate", generateTopicContent);
router.post("/quiz", generateQuiz);  // ← this line must exist

module.exports = router;
