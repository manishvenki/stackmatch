# StackMatch

> **Plan smarter. Choose better. Build with confidence.**

---

## 1. Overview

**StackMatch** is an AI-powered product discussion, project planning, and technology knowledge platform that helps technical and non-technical people turn a simple product idea into a structured, understandable, build-ready project plan.

Users describe their concept naturally in plain words without needing to know technical terminology. StackMatch guides them through an intelligent scoping journey to define requirements, evaluate technology options with side-by-side trade-offs, visualize multi-tier system architectures, and construct a phased development roadmap.

---

## 2. Core Flow

```text
Idea
↓
AI Discussion
↓
Requirements
↓
Features
↓
Project Plan
↓
Technology
↓
Architecture
↓
Roadmap
↓
Knowledge / Learning
↓
Project Blueprint
```

---

## 3. Current Status

```text
Phase 1 — Completed
Phase 2 — Coming Soon
Phase 3 — Coming Soon
```

---

## 4. Phase 1 Scope

Phase 1 establishes the product foundation, locked Neutral Minimal design system, responsive multi-platform UI, and core project planning experience:

- **Landing Page:** Hero presentation, supporting workspace preview for *College Food Ordering Platform*, and product trust metrics.
- **AI Project Discussion Studio:** Conversational workspace with stage tracking (`1 Idea → 2 Requirements → 3 Planning → 4 Finalize`), message history, and interactive response chips (*"Students, restaurants and admin"*, *"Both web and mobile"*, *"Online payments"*).
- **Project Overview:** Executive summary card, primary user breakdown, timeline, complexity metrics, and checked project goals.
- **Requirements Workspace:** Categorized functional and non-functional requirements with priority badges (`High`, `Medium`, `Low`).
- **Recommended Tech Stack:** Interactive cards with match scoring (React 94%, Node.js 92%, PostgreSQL 94%, Razorpay 90%, Docker 90%).
- **Technology Details:** In-depth evaluation covering *Overview, Why Recommended, Benefits, Trade-offs, Alternatives, Real-world Usage*, and horizontal metric indicators.
- **Side-by-Side Comparison Matrix:** Comparative evaluation matrix (e.g. PostgreSQL vs MongoDB vs MySQL) across 8 dimensions with recommended visual highlighting.
- **System Architecture Visualizer:** Layered topography covering Client Tier, API Gateway, Persistence, and External Integrations.
- **4-Phase Development Roadmap:** Sequential delivery milestones with timeline estimates and checklist deliverables.
- **Curated Learning Resources:** Categorized guides, documentation, and video tutorials.
- **Executive Blueprint Preview:** Pre-flight proposal preview with *"What's Included"* checklist ready for client review.
- **Backend API Service:** Express + TypeScript RESTful API with token-based JWT authorization, password hashing, Mongoose schemas, and automated test suite.
- **Mobile Experience:** React Native / Expo application with bottom navigation, segmented tabs, and touch-friendly cards.

---

## 5. Technology Stack

### Web Application (`apps/web`)
- **Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Neutral Minimal design system)
- **Icons:** Lucide React

### Mobile Application (`apps/mobile`)
- **Framework:** React Native, Expo
- **Language:** TypeScript

### Backend API (`backend`)
- **Runtime:** Node.js, Express
- **Language:** TypeScript
- **Database:** MongoDB & Mongoose (with synchronized persistence engine)
- **Security:** JWT (JSON Web Tokens), bcryptjs password hashing, CORS

### Shared Packages (`packages/types`)
- **Contracts:** Shared TypeScript interfaces for User, Project, Requirement, Technology, Architecture, Roadmap, and Message schemas.

---

## 6. Project Structure

```text
stackmatch/
│
├── apps/
│   ├── web/                    # React + Vite web application
│   └── mobile/                 # React Native / Expo mobile application
│
├── backend/                    # Express + Node.js API service
│   ├── src/
│   │   ├── controllers/        # Auth, Project, and Message handlers
│   │   ├── models/             # Mongoose schemas (User, Project, Conversation, Requirement)
│   │   ├── services/           # Storage and domain services
│   │   ├── routes/             # RESTful API routes
│   │   └── tests/              # Foundational test suite
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

## 7. Local Development

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation
Clone the repository and install dependencies:
```bash
# Clone the repository
git clone https://github.com/manishvenki/stackmatch.git
cd stackmatch

# Install shared types and backend
npm --prefix packages/types install
npm --prefix packages/types run build
npm --prefix backend install

# Install web application
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

#### 3. Run Test Suite
```bash
npm run test:backend
```
Validates authentication, JWT guards, project CRUD, conversations, and domain views (16/16 tests passing).

#### 4. Run Mobile Client (Expo)
```bash
npm --prefix apps/mobile install
npm --prefix apps/mobile run start
```

---

## 8. Environment Variables

Copy `.env.example` to `.env` to configure local runtime settings:

```bash
cp .env.example .env
```

Template variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stackmatch
JWT_SECRET=
CLIENT_URL=http://localhost:5173
AI_PROVIDER=openai
AI_API_KEY=
```

---

## 9. Product Boundary

StackMatch currently focuses on:
- Product discussion and requirement clarification
- Requirements prioritization and categorization
- Technology selection and trade-off matrices
- Architecture planning and topography visualization
- Development roadmap planning
- Build-ready blueprint generation

StackMatch is **NOT** currently an autonomous:
- Code generator
- Repository builder
- Deployment platform
- Production application generator

Those capabilities belong to future phases of the roadmap.
