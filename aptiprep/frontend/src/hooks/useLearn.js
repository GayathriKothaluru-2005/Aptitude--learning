// hooks/useLearn.js
// Fetches STATIC topic content from GET /api/learn/:slug
// No AI involved. Fast, instant response.
// Client-side cache prevents duplicate requests in the same session.

import { useState, useCallback, useRef } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export function useLearn() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Session cache: { "percentages": { ...data } }
  const cache = useRef({});

  const fetchLearnContent = useCallback(async (slug) => {
    if (!slug) return null;

    const key = slug.trim().toLowerCase();

    // Return cached data immediately
    if (cache.current[key]) return cache.current[key];

    setLoading(true);
    setError(null);

    try {
      const res  = await fetch(`${API_BASE}/api/learn/${encodeURIComponent(key)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Server error ${res.status}`);
      }

      cache.current[key] = json.data;
      return json.data;

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchLearnContent, loading, error };
}
