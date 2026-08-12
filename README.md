# ⚡ AlgoMate

> Your all-in-one Data Structures and Algorithms (DSA) learning hub, complete with curated notes, an online compiler, and an AI-powered RAG chatbot for intelligent, context-grounded learning.

🌐 **Live Demo:** [AlgoMate Application](https://algomate-yhqd.onrender.com/)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [AI Chatbot & RAG Architecture](#-ai-chatbot--rag-architecture)
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

**AlgoMate** is an AI-powered DSA learning platform designed to help students prepare for coding interviews and strengthen their programming fundamentals.

Instead of switching between multiple platforms for learning concepts, practicing problems, compiling code, and clearing doubts, AlgoMate brings these capabilities together in one application.

The platform includes structured DSA notes, an online code compiler, practice resources, and an AI-powered chatbot.

The chatbot uses a lightweight **Retrieval-Augmented Generation (RAG)** architecture to provide answers grounded in AlgoMate's own DSA knowledge base while still using Gemini to generate natural, educational responses.

---

## ✨ Key Features

- 📚 **Topic-Wise DSA Notes:** Structured learning material covering Arrays, Linked Lists, Stacks, Queues, Trees, Recursion, Searching, Sorting, and other DSA concepts.
- 💻 **In-Browser Code Compiler:** Execute and test code directly from the browser using supported programming languages.
- 🤖 **RAG-Powered AI Chatbot:** Uses AlgoMate's knowledge base as contextual information before generating responses with Google Gemini.
- 💡 **Progressive Hints:** Get hints for coding problems without directly revealing the complete solution.
- 🐛 **Code Explanation & Debugging:** Understand code, identify errors, and improve implementations.
- 🔍 **Dry Runs:** Get step-by-step explanations of algorithm execution.
- 🎯 **Interview Preparation:** Learn concepts, complexity analysis, common patterns, and interview problems.
- 📝 **Similar Problems:** Get related coding problems for additional practice.
- 💬 **Conversation History:** The chatbot maintains recent conversation context to provide more relevant responses.
- 🎨 **Responsive UI:** Built with React and Tailwind CSS for a clean and interactive learning experience.

---

## 🧠 AI Chatbot & RAG Architecture

AlgoMate's chatbot follows a **Retrieval-Augmented Generation (RAG)** approach.

Instead of relying entirely on the language model's general knowledge, the system first searches the AlgoMate DSA knowledge base for information relevant to the user's question.

The retrieved knowledge is then provided to Gemini as context, allowing the model to generate a more relevant and educational response.

### 🔄 RAG Flow

```text
                    User Question
                         │
                         ▼
              ┌─────────────────────┐
              │ Knowledge Base      │
              │ Retrieval           │
              └──────────┬──────────┘
                         │
                  Relevant Context
                         │
                         ▼
              ┌─────────────────────┐
              │ Conversation        │
              │ History             │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ System Prompt       │
              │ DSA Tutor Rules     │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Google Gemini API   │
              │ Response Generation │
              └──────────┬──────────┘
                         │
                         ▼
                  Educational Answer
