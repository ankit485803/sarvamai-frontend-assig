# Sarvam AI Frontend Intern Assignment

## 📌 Objective

This project is built as part of the **Frontend Intern Assignment** for Sarvam AI.

The goal is to design and implement a **browser-based Inference Playground** and a **Model Output Diff Viewer** for enterprise engineers. The system simulates a developer portal where users can test AI model inputs, view streaming outputs, and compare results across model versions.

---

## 🚀 Project Overview

The application focuses on building a modern frontend experience with the following capabilities:

### Part A — Inference Playground

A React + TypeScript-based playground that allows users to:

- Input prompts using **text or audio**
- Toggle between input modes
- Receive **streaming model responses (token-by-token)**
- View real-time metrics:
  - Token count
  - Tokens per second (TPS)
- Handle errors gracefully during streaming:
  - Network failures
  - Timeouts
  - Interrupted streams
- Maintain accessibility standards (WCAG AA)
- Ensure full keyboard navigation support

---

### Part B — Model Output Diff View

A comparison tool that allows users to:

- Compare outputs from two different model versions
- Highlight **token-level differences**
- Build a custom diffing algorithm (no external diff libraries used)

The system also includes an explanation of:
- Diffing algorithm approach
- Time complexity
- Comparison with other approaches (LCS, Myers diff, etc.)

---

## 🛠 Tech Stack

- React
- TypeScript
- Vite
- React Media Recorder (for audio input)
- Fetch API + ReadableStream (for streaming responses)

---

## 📦 Installation & Setup

Clone the repository and run the project locally:

```bash
git clone https://github.com/ankit485803/sarvamai-frontend-assig
cd sarvamai-frontend-assig
npm install
npm run dev