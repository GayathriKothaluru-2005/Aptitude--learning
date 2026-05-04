// components/TopicList.jsx — Simple flat vertical list, no categories, no progress indicators
import React from "react";
import { Link } from "react-router-dom";

export default function TopicList({ topics }) {
  if (topics.length === 0) {
    return (
      <div className="glass py-12 text-center animate-fade-in">
        <p className="text-slate-500 text-sm">No topics match your search.</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden animate-fade-up">
      <ul className="list-none m-0 p-0">
        {topics.map((topic) => (
          <li key={topic.slug} className="topic-row last:border-0">
            <Link
              to={`/topic/${topic.slug}`}
              className="flex items-center justify-between px-5 py-3.5 group no-underline"
            >
              {/* Topic name — same look always, no done state */}
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium">
                {topic.name}
              </span>

              {/* Arrow */}
              <span
                className="text-slate-600 group-hover:text-primary transition-all duration-200 group-hover:translate-x-0.5"
                style={{ display: "inline-block" }}
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
