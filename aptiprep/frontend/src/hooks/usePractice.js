// hooks/usePractice.js
// Calls POST /api/practice — the only AI endpoint in the app.
// Fix: shows json.details when json.error is vague.

import { useState, useCallback, useRef } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function usePractice() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const cache = useRef({});

  const fetchPracticeQuestions = useCallback(async (topicName) => {
    if (!topicName) return null;

    const key = topicName.trim().toLowerCase();

    if (cache.current[key]) return cache.current[key];

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/practice`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ topic: topicName }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        // FIX: show details if available, fall back to error
        throw new Error(json.details || json.error || `Server error ${res.status}`);
      }

      cache.current[key] = json.questions;
      return json.questions;

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCache = useCallback((topicName) => {
    if (topicName) delete cache.current[topicName.trim().toLowerCase()];
    else cache.current = {};
  }, []);

  return { fetchPracticeQuestions, clearCache, loading, error };
}
