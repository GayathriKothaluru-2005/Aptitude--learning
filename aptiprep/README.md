# AptiPrep — Aptitude Learning Platform

> A clean, dark-themed aptitude learning web app with AI-powered explanations, practice questions, and quizzes.

---

## 🗂️ Project Structure

```
aptiprep/
├── frontend/                    # React + Tailwind CSS
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Sticky top nav
│   │   │   ├── Hero.jsx         # Hero section + search bar
│   │   │   ├── TopicList.jsx    # Vertical topic list (no cards)
│   │   │   └── QuestionItem.jsx # Single question with reveal
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── TopicDetail.jsx  # Topic content page ⭐
│   │   │   ├── Practice.jsx     # Practice questions
│   │   │   ├── Quiz.jsx         # Scored quiz
│   │   │   └── Progress.jsx     # User progress tracker
│   │   ├── data/
│   │   │   └── topicsData.js    # 15 aptitude topics with local content
│   │   ├── hooks/
│   │   │   └── useAI.js         # Custom hook for Groq API calls
│   │   ├── utils/
│   │   │   └── progress.js      # localStorage progress helpers
│   │   ├── App.jsx
│   │   └── index.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                     # Node.js + Express + Groq API
    ├── routes/
    │   └── aiRoutes.js          # API route definitions
    ├── controllers/
    │   └── aiController.js      # Groq integration logic
    ├── server.js                # Express entry point
    ├── .env.example
    └── package.json
```

---

## ⚡ Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
npm run dev
# Server runs at http://localhost:5000
```

Get your Groq API key free at: https://console.groq.com

### 2. Frontend

```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint        | Body                        | Description                          |
|--------|-----------------|-----------------------------|--------------------------------------|
| POST   | /api/generate   | `{ topic: "Percentages" }`  | Generate full topic content via AI   |
| POST   | /api/quiz       | `{ topic: "...", count: 8 }`| Generate quiz questions via AI       |

---

## 🎨 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 18, Tailwind CSS, React Router v6 |
| Backend   | Node.js, Express              |
| AI        | Groq SDK (LLaMA 3 70B)        |
| Storage   | localStorage (progress tracking) |
| Data      | In-memory JSON (no database needed) |

---

## 📄 Pages

| Page          | Route               | Description                             |
|---------------|---------------------|-----------------------------------------|
| Home          | `/`                 | Hero + full topic list with search      |
| Topic Detail  | `/topic/:topicName` | Explanation, formulas, shortcuts, Q&A   |
| Practice      | `/practice`         | Topic-filtered practice questions       |
| Quiz          | `/quiz`             | Scored multiple choice quiz             |
| Progress      | `/progress`         | Topics viewed + quiz history            |

---

## 🧠 AI Features

- **Topic Detail page**: Click "Generate with AI" to fetch rich content from Groq LLaMA
- **Quiz page**: Toggle "Use AI questions" for dynamically generated quiz questions
- AI responses are structured JSON (explanation, formulas, shortcuts, questions)

---

## 🌱 Extending the App

- **Add a database**: Replace `topicsData.js` with MongoDB/PostgreSQL queries
- **User auth**: Add JWT auth to track per-user progress server-side
- **More topics**: Add entries to `topicsData.js` — they appear automatically
- **Timed quiz**: Add a countdown timer to `Quiz.jsx`
