// pages/Home.jsx — Landing page (section header + topic count removed)
import React, { useState } from "react";
import Hero from "../components/Hero";
import TopicList from "../components/TopicList";
import { TOPICS } from "../data/topicsData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = TOPICS.filter((topic) => {
    const q = searchQuery.toLowerCase();
    return (
      topic.name.toLowerCase().includes(q) ||
      topic.category.toLowerCase().includes(q)
    );
  });

  return (
    <main className="max-w-6xl mx-auto px-5">
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* ── "All Topics" heading + count badge removed ── */}

      <TopicList topics={filteredTopics} />
      <div className="h-20" />
    </main>
  );
}
