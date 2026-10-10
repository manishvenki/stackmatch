# Contributing to StackMatch

Thank you for your interest in contributing to **StackMatch**!

**StackMatch** is an AI-assisted project planning and architecture studio that helps founders, engineers, and product teams scope requirements, discover the right technology stack, model 3-tier architectures, phase delivery roadmaps, and generate executive engineering blueprints.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (default port `27017`) or MongoDB Atlas URI (optional; memory store fallback is active if MongoDB is unavailable)

### Clone & Install
```bash
# Clone the repository
git clone https://github.com/manishvenki/stackmatch.git
cd stackmatch

# Install workspace dependencies
npm install
```

### Environment Configuration
```bash
# Copy root environment file
cp .env.example .env

# Copy backend environment file
cp backend/.env.example backend/.env
```

### Starting the Local Development Stack
```bash
# Concurrently boots types compiler, Express backend (port 5000), and Vite web app (port 5173)
npm run dev
```

---

## 🏗️ Architecture & Workspaces

The repository is structured as an npm workspaces monorepo:

- **`packages/types`**: Shared TypeScript domain interfaces (Project, Requirement, Technology, Architecture, Roadmap, Blueprint).
- **`apps/web`**: React 18, Vite, TypeScript, and Tailwind CSS web application.
- **`backend`**: Node.js, Express, TypeScript, Mongoose/MongoDB, and Google Gemini API integration.

---

## 🧪 Testing & Verification

Before submitting a Pull Request, verify that all builds and tests pass cleanly:

```bash
# Build shared types
npm run build:types

# Build backend
npm run build:backend

# Build web frontend
npm run build:web

# Run full monorepo build
npm run build
```

---

## 📋 Pull Request Guidelines

1. **Branch Naming**: Use descriptive branch names:
   - `feat/feature-name`
   - `fix/bug-description`
   - `docs/documentation-update`
2. **Commit Conventions**: Follow conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
3. **Keep User Work Safe**: Never introduce regressions to project persistence or blueprint PDF rendering.
4. **No Secrets**: Never commit real API keys, passwords, or `.env` files.

---

## 💬 Community & Credits

- Created and maintained by **Manish** ([@manishvenki](https://github.com/manishvenki))
- Repository: [https://github.com/manishvenki/stackmatch](https://github.com/manishvenki/stackmatch)
