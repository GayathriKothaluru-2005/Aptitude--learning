// server.js — Aptitude Platform API Server
require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const learnRoutes    = require("./routes/learnRoutes");
const practiceRoutes = require("./routes/practiceRoutes");
const aiRoutes       = require("./routes/aiRoutes");       // ← ADD THIS

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api", learnRoutes);
app.use("/api", practiceRoutes);
app.use("/api", aiRoutes);                                 // ← MOVE OUT of comment

// ── Health check ────────────────────────────────────────────
app.get("/", (_req, res) =>
  res.json({ status: "ok", message: "Aptitude API running 🚀" })
);

// ── 404 handler ─────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ error: "Route not found." })
);

// ── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ error: "Internal server error.", details: err.message });
});

app.listen(PORT, () =>
  console.log(`✅ Aptitude API → http://localhost:${PORT}`)
);