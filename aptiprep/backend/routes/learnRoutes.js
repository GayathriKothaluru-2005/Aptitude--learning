// routes/learnRoutes.js — Static learn content routes
const express = require("express");
const router  = express.Router();
const { getLearnContent, getAllTopics } = require("../controllers/learnController");

// GET /api/learn           → list of all topics
router.get("/learn", getAllTopics);

// GET /api/learn/:slug     → full static content for one topic
router.get("/learn/:slug", getLearnContent);

module.exports = router;
