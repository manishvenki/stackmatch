# StackMatch — Architecture Specification

## Monorepo & System Topology

```text
stackmatch/
│
├── apps/
│   ├── web/          # React + TypeScript + Vite + Tailwind CSS
│   └── mobile/       # React Native + Expo + TypeScript
│
├── backend/          # Node.js + Express + TypeScript + Mongoose + JWT
│
├── packages/
│   └── types/        # Shared TypeScript contracts and schemas
│
├── docs/             # Technical and architectural documentation
└── .env.example
```

---

## 3-Tier Layered Architecture

```text
           [ Web App (React) ]         [ Mobile App (Expo) ]
                   │                            │
                   └─────────────┬──────────────┘
                                 │ HTTPS / JSON
                                 ▼
                     [ Backend API Gateway ]
                     Node.js + Express + TypeScript
                     JWT Auth / Input Validation
                                 │
         ┌───────────────────────┼────────────────────────┐
         ▼                       ▼                        ▼
 [ Primary Database ]    [ Cloud Storage ]       [ Payment Gateway ]
 PostgreSQL / MongoDB      S3 Object Store            Razorpay API
```

---

## Data Models & Schema Design

1. **User:**
   - Identity, credentials hash, permissions role, timestamps.
2. **Project:**
   - User ownership, title, description, stage (`idea`, `requirements`, `planning`, `finalize`), executive summary.
3. **Conversation & Message:**
   - Project-scoped message thread, role (`user`, `assistant`, `system`), metadata with suggested interactive response chips.
4. **Requirement:**
   - Type (`functional`, `non-functional`), priority level (`high`, `medium`, `low`), category.
5. **Technology & Comparisons:**
   - Category, match score, trade-offs, metrics, side-by-side matrices.
6. **Roadmap:**
   - Phased milestones, timeline estimates, checklist deliverables.
