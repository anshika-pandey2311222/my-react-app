# ⚡ AlgoMate

> Your all-in-one Data Structures and Algorithms (DSA) learning hub, complete with curated notes, an online compiler, and an AI coding assistant.

🌐 **Live Demo:** [AlgoMate Application](https://algomate-yhqd.onrender.com/)

---

## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 About the Project

**AlgoMate** is designed to streamline your DSA preparation for coding interviews and competitive programming. Instead of switching between multiple tabs for notes, code compilation, and doubt clearing, AlgoMate brings everything into a single, seamless platform.

---

## ✨ Key Features

- 📚 **Topic-Wise DSA Notes:** Comprehensive, structured guides covering core topics like Arrays, Linked Lists, Trees, Stacks, Queues, Recursion, Searching, Sorting, and Dynamic Programming.
- 💻 **In-Browser Code Compiler:** Execute and test your code directly on the web with support for popular languages (Python, C++, Java, JavaScript).
- 🤖 **AI-Powered Coding Assistant:** Integrated with the Gemini API to help debug errors, explain complex algorithms, and provide hints on demand.
- 🎨 **Responsive & Modern UI:** Designed with React and Tailwind CSS for a fast, clean, and interactive user experience.

---

## 🛠 Tech Stack

### **Frontend**
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Icons & Components:** Lucide React / Heroicons

### **Backend**
- **Runtime/Framework:** Node.js (Express) *or* Python (FastAPI / Flask)
- **AI Integration:** Google Gemini API
- **Code Execution:** Third-party Code Execution APIs (e.g., Judge0, PaizaIO)

---

## 📂 Project Architecture

```text
AlgoMate/
├── backend/          # Backend server code (Express/Flask)
│   ├── routes/       # API endpoints (Compiler, AI Assistant)
│   ├── controllers/  # Logic handlers
│   ├── .env.example  # Template for backend environment variables
│   └── package.json  # or requirements.txt
├── frontend/         # React single-page application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
└── README.md
