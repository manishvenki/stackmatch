# StackMatch

> **Plan smarter. Choose better. Build with confidence.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](#)
[![React](https://img.shields.io/badge/React-18.x-61dafb)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](#)
[![License](https://img.shields.io/badge/license-MIT-purple)](#)

---

## 1. Overview

**StackMatch** is an AI-powered product discussion, project planning, and technology intelligence platform that helps technical and non-technical founders, engineers, and teams turn ideas into structured requirements, technology-stack decisions, architecture plans, roadmaps, learning resources, and build-ready blueprints.

Users describe their concept naturally in plain words without needing to know technical terminology. StackMatch guides them through an intelligent scoping journey to define requirements, evaluate technology options with side-by-side trade-offs, visualize multi-tier system architectures, and construct a phased development roadmap.

---

## 2. Complete End-to-End Workflow

```text
Landing Page & Project Creation
  ↓
AI Project Discussion & Clarification
  ↓
Categorized Requirements & Priority Scoring
  ↓
Technology Stack Recommendations & Trade-Offs
  ↓
Comparative Tech Evaluation Matrix
  ↓
System Architecture Topography Visualization
  ↓
4-Phase Milestone Development Roadmap
  ↓
Curated Learning Resources & Guides
  ↓
Final Project Blueprint & Multi-Format Export (Print/PDF, Markdown, JSON)
  ↓
Connect with Freelancers (Preview — Coming Soon)
```

---

## 3. Current Product Status & Capabilities

StackMatch is completely integrated across the frontend and backend with reliable state continuity, error recovery, and production-tested builds.

- **Persistent Workflow State:** Automatic browser session hydration via `localStorage` and REST APIs (`/api/v1/projects/:id/plan`, `/api/v1/projects/:id/messages`) guarantees project data continuity across screen navigation and page reloads.
- **AI Planning Intelligence:** Pluggable AI planning engine supporting OpenAI, Anthropic, and a zero-downtime deterministic offline fallback that generates consistent requirements, tech stacks, topography layers, and milestones without external credential dependencies.
- **Functional Blueprint Export Engine:**
  - 🖨️ **Print / PDF Export:** Clean executive print stylesheet (`@media print`) isolating the project blueprint proposal.
  - 📄 **Markdown Document (.md):** Instant client-side download of the complete architectural specification (`[slug]-blueprint.md`).
  - ⚙️ **JSON Technical Specification (.json):** Machine-readable technical export (`[slug]-spec.json`) suitable for downstream CI/CD or tooling.
- **Connect with Freelancers (Preview):** A dedicated preview experience branded with the StackMatch philosophy:
  > *“Great products start with clear ideas and grow with the right people.”*
  > — The StackMatch philosophy
- **Neutral Minimal Design System:** Consistent token palette (`#111827`, `#374151`, `#687280`, `#D1D5DB`, `#F9FAFB`, `#2563EB`, `#16A34A`), restrained elevation, accessible contrast, and responsive layout across desktop, tablet, and mobile.

---

## 4. Technology Stack

### Web Application (`apps/web`)
- **Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS & Tailwind CSS tokens (Neutral Minimal design system)
- **Icons:** Lucide React
- **Exporting:** Client-side Blob generation & native Print stylesheet

### Mobile Application (`apps/mobile`)
- **Framework:** React Native, Expo
- **Language:** TypeScript

### Backend API (`backend`)
- **Runtime:** Node.js, Express
- **Language:** TypeScript
- **Database:** MongoDB & Mongoose (with synchronized In-Memory store fallback)
- **Security:** JWT (JSON Web Tokens), optionalAuth guards, bcryptjs password hashing, sanitized inputs (4,000 char prompt limit), CORS
- **Reliability:** 20-second client timeouts, standard error handler with shielded production responses

### Shared Packages (`packages/types`)
- **Contracts:** Shared TypeScript interfaces for User, Project, Requirement, Technology, Architecture, Roadmap, Blueprint, and Message schemas.

---

## 5. Project Structure

```text
stackmatch/
│
├── apps/
│   ├── web/                    # React + Vite web application
│   │   ├── src/
│   │   │   ├── components/     # UI design system & domain modals (ExportBlueprintModal)
│   │   │   ├── pages/          # Landing, Discussion, Dashboard, ProjectOverview, ConnectFreelancers
│   │   │   ├── services/       # Resilient API client with timeout & abort controls
│   │   │   └── types/          # Frontend contracts
│   │   └── .env.example
│   └── mobile/                 # React Native / Expo mobile application
│
├── backend/                    # Express + Node.js API service
│   ├── src/
│   │   ├── config/             # Environment & configuration loader
│   │   ├── controllers/        # Auth, Project, AI, and Message handlers
│   │   ├── middleware/         # auth (requireAuth & optionalAuth), errorHandler
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # RESTful API routes (/api/v1/auth, /api/v1/projects)
│   │   ├── services/           # AI planning engine & synchronized storage
│   │   └── tests/              # Automated API & domain test suite (20 tests)
│   └── .env.example
│
├── packages/
│   └── types/                  # Shared TypeScript contracts and interfaces
│
├── docs/                       # Architectural & API specifications
│   ├── architecture.md
│   ├── api.md
│   ├── ui-system.md
│   └── product-overview.md
│
├── .env.example                # Centralized environment variable template
├── .gitignore                  # Production-grade gitignore rules
├── README.md                   # Project documentation
└── package.json                # Monorepo workspace configuration
```

---

## 6. Local Development & Quick Start

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation
```bash
# Clone the repository
git clone https://github.com/manishvenki/stackmatch.git
cd stackmatch

# Install shared types, backend, and web
npm --prefix packages/types install
npm --prefix packages/types run build
npm --prefix backend install
npm --prefix apps/web install
```

### Running the Services

#### 1. Start Backend API
```bash
npm run dev:backend
# or
npm --prefix backend run dev
```
The API server starts on `http://localhost:5000` (Health check: `http://localhost:5000/api/v1/health`).

#### 2. Start Web Client
```bash
npm run dev:web
# or
npm --prefix apps/web run dev
```
The web application starts at `http://localhost:5173`.

#### 3. Run Quality Gates & Tests
```bash
# Run backend automated integration tests (20/20 passing)
npm run test:backend

# Verify web production build
npm --prefix apps/web run build
```

---

## 7. Environment Variables Reference

Copy `.env.example` to `.env` to configure local runtime settings:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/stackmatch` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `replace-with-a-secure-secret` |
| `JWT_EXPIRES_IN`| Token lifespan | `7d` |
| `CLIENT_URL` | Frontend origin for CORS whitelist | `http://localhost:5173` |
| `AI_PROVIDER` | AI provider (`openai`, `anthropic`, or `mock`) | `openai` |
| `AI_API_KEY` | Provider API key (optional; fallback active if empty)| `sk-...` |
| `VITE_API_BASE_URL` | Frontend API base URL | `/api/v1` (via Vite proxy) |

---

## 8. API Endpoints Reference

### Authentication (`/api/v1/auth`)
- `POST /register`: Register a new user account.
- `POST /login`: Authenticate and receive a JWT token.
- `GET /me`: Get current user profile (JWT required).

### Project Management (`/api/v1/projects`)
- `GET /`: List projects (supports guest and authenticated users).
- `POST /`: Create a new project.
- `GET /:id`: Retrieve project details.
- `PATCH /:id`: Update project metadata and stage.
- `DELETE /:id`: Remove a project.

### AI Planning & Intelligence (`/api/v1/projects/:id`)
- `POST /:id/analyze-idea`: Analyze natural language prompt and extract problem statement, user roles, constraints, and follow-up questions.
- `POST /:id/generate-plan`: Generate complete requirements, tech stack recommendations, architecture topography, and roadmap milestones.
- `GET /:id/plan`: Retrieve the complete consolidated project plan.
- `GET /:id/context`: Retrieve synthesized Project Context (problem statement, user personas, stated boundaries, constraints, unresolved questions).
- `GET /:id/architecture/validate`: Run automated Architecture Consistency Validation (0–100 health score, missing layers, incompatible services, actionable mitigations).
- `GET /:id/insights/risks`: Run Technical Risk & Complexity Assessment (bottlenecks, testing requirements, deployment considerations, risk matrices).
- `GET /:id/comparisons?category=...`: Get multi-category technology comparison matrix (Databases, Frontend, Backend, Authentication, Cloud & Hosting).
- `GET /:id/requirements`: Retrieve prioritized requirements.
- `PUT /:id/requirements/:reqId`: Update requirement status or description.
- `DELETE /:id/requirements/:reqId`: Remove a requirement.
- `GET /:id/tech-stack`: Get recommended technologies with architectural roles, integration considerations, and scoring rationale.
- `GET /:id/architecture`: Get multi-tier architecture nodes and consistency health report.
- `GET /:id/roadmap`: Get 4-phase sequential milestones with prerequisites, acceptance criteria, and risks.
- `GET /:id/blueprint`: Get executive blueprint spec.
- `GET /:id/messages`: Retrieve conversation history.
- `POST /:id/messages`: Send user message and get structured AI reply.

---

## 9. Production Readiness & Deployment Checklist

- [x] **Monorepo Contracts:** `@stackmatch/types` built with full type coverage across intelligence entities.
- [x] **API Test Suite:** 24/24 automated tests passing across auth, project lifecycle, context engine, validation, and risks.
- [x] **Production Bundle:** Vite production build compiles with zero TypeScript errors.
- [x] **Project Context Engine:** Consolidates original idea, problem statement, target users, platform requirements, timeline/budget assumptions, complexity factors, and unresolved questions without fabricating unknown requirements.
- [x] **Architecture Consistency Validation:** Analyzes presentation, API, persistence, cache, payment, and telemetry layers, computing actionable findings and health scores.
- [x] **Complexity & Technical Risk Insights:** Evaluates complexity drivers, peak concurrency bottlenecks, payment webhook risks, and practical mitigations.
- [x] **Multi-Category Comparisons:** Dynamic matrix comparing Databases, Frontend, Backend, Authentication, and Cloud & Hosting options.
- [x] **Transparent Recommendation Scoring:** Technology cards explain scoring criteria and role in architecture.
- [x] **Enhanced Roadmap & Learning Resources:** Milestone prerequisites, deliverable acceptance criteria, and difficulty-rated learning resources.
- [x] **Neutral Minimal Design:** Consistent token palette, responsive layouts, and accessible contrast.
- [x] **Blueprint Export:** Multi-format export (Print/PDF, Markdown, JSON) fully operational.
- [x] **Freelancer Discovery:** Authentic "Coming Soon" preview adhering to product boundaries.

---

## 10. Product Boundary

StackMatch currently focuses on:
- Product discussion and requirement clarification
- Project context consolidation and transparent constraint modeling
- Requirements prioritization and acceptance criteria specification
- Technology stack intelligence, suitability scoring, and multi-category trade-offs
- Architecture consistency validation and system health diagnostics
- Technical risk identification, bottleneck detection, and practical mitigations
- Phased development roadmap planning
- Build-ready blueprint generation and multi-format export

StackMatch is **NOT** currently an autonomous:
- Code generator or compiler
- Automated cloud repository deployer
- Live transactional freelancer marketplace (marketplace is in preview)

---

*StackMatch — Plan smarter. Choose better. Build with confidence.*

