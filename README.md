# SmartDesk AI

SmartDesk AI is an AI-powered workplace productivity assistant designed to help professionals automate common workplace tasks. It combines a modern SaaS-style dashboard with a suite of intelligent AI tools, all accessible from a single responsive interface.

## Project Overview

This application provides a clean, professional dashboard with a collapsible sidebar for navigating between AI productivity tools. Users can generate emails, summarize meeting notes, plan tasks, conduct research, and chat with an AI assistant. Each tool is built around structured prompts and produces editable outputs that can be reviewed and refined before use.

## Features Implemented

- **Smart Email Generator** — Generate professional emails based on tone, recipient, and purpose. Edit the result before copying or sending.
- **Meeting Notes Summarizer** — Paste raw meeting notes and receive a concise summary with key points and action items.
- **AI Task Planner** — Break down projects into prioritized, step-by-step tasks with deadlines and deliverables.
- **AI Research Assistant** — Research topics and receive structured summaries with sources and key insights.
- **AI Chatbot Interface** — Conversational assistant for general workplace questions and brainstorming.
- **Modern Dashboard UI** — Clean, SaaS-inspired layout with sidebar navigation, page headers, and responsive design.
- **Editable AI Outputs** — All AI-generated content is shown in editable form so users can refine results.
- **Responsible AI Disclaimer** — Clear messaging that AI outputs should be reviewed and verified before professional use.

## Technologies and Tools Used

- **Framework:** TanStack Start v1 (full-stack React framework with SSR/SSG support)
- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4, shadcn/ui components, Radix UI primitives
- **Routing:** TanStack Router (file-based routing)
- **State & Data:** TanStack Query
- **AI Integration:** Lovable AI Gateway via `ai` SDK and `@ai-sdk/openai-compatible`
- **Forms & Validation:** React Hook Form, Zod
- **Icons:** Lucide React
- **Package Manager:** Bun
- **Linting & Formatting:** ESLint, Prettier
- **Development Platform:** Lovable

## Setup Instructions

1. **Clone the repository** and open the project directory.
2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Start the development server:**

   ```bash
   bun dev
   ```

4. Open the local preview URL shown in the terminal (usually `http://localhost:8080`).

### Optional commands

- **Build for production:**

  ```bash
  bun build
  ```

- **Preview the production build:**

  ```bash
  bun preview
  ```

- **Lint and format:**

  ```bash
  bun lint
  bun format
  ```

## Team Members

- *(Add team members here if applicable)*

---

> **Responsible AI Notice:** SmartDesk AI uses artificial intelligence to generate content. Please review all AI-generated outputs for accuracy, tone, and appropriateness before using them in professional or client-facing contexts.
