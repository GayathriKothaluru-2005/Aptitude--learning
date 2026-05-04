// App.jsx — Root component with all routes
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar        from "./components/Navbar";
import Home          from "./pages/Home";
import LearnPage     from "./pages/LearnPage";
import PracticeHome  from "./pages/PracticeHome";
import PracticePage  from "./pages/PracticePage";
import Quiz          from "./pages/Quiz";
import Progress      from "./pages/Progress";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg text-white">
        <Navbar />
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/topic/:topicSlug"    element={<LearnPage />} />
          <Route path="/practice"            element={<PracticeHome />} />
          <Route path="/practice/:topicSlug" element={<PracticePage />} />
          <Route path="/quiz"                element={<Quiz />} />
          <Route path="/progress"            element={<Progress />} />
        </Routes>
      </div>
    </Router>
  );
}
