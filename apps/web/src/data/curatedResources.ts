export type ResourceCategory =
  | 'Getting Started'
  | 'Technology Stack Guides'
  | 'Architecture & System Design'
  | 'Database Guides'
  | 'DevOps & Deployment'
  | 'Project Planning'
  | 'Security & Best Practices'
  | 'Useful Tools';

export type ResourceType =
  | 'Official Documentation'
  | 'StackMatch Guide'
  | 'Architecture Playbook'
  | 'Checklist & Reference';

export interface CuratedResource {
  id: string;
  title: string;
  category: ResourceCategory;
  type: ResourceType;
  description: string;
  learningOutcomes: string[];
  technology: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  url: string;
  isOfficialDoc: boolean;
  featured?: boolean;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'Getting Started',
  'Technology Stack Guides',
  'Architecture & System Design',
  'Database Guides',
  'DevOps & Deployment',
  'Project Planning',
  'Security & Best Practices',
  'Useful Tools',
];

export const CURATED_RESOURCES: CuratedResource[] = [
  // 1. Getting Started
  {
    id: 'res-gs-01',
    title: 'How to Scope an MVP Without Over-Engineering',
    category: 'Getting Started',
    type: 'StackMatch Guide',
    description: 'Learn the systematic framework for defining MVP core features, trimming technical excess, and launching within 4-6 weeks.',
    learningOutcomes: [
      'Identify the single core problem your product must solve',
      'Distinguish must-have functionality from nice-to-have distractions',
      'Establish a clear definition of launch readiness'
    ],
    technology: 'Product Strategy',
    difficulty: 'Beginner',
    readTime: '6 min read',
    url: 'https://en.wikipedia.org/wiki/Minimum_viable_product',
    isOfficialDoc: false,
    featured: true,
  },
  {
    id: 'res-gs-02',
    title: 'Writing Functional vs. Non-Functional Requirements',
    category: 'Getting Started',
    type: 'StackMatch Guide',
    description: 'A practical template for documenting user actions, system performance, security boundaries, and scalability expectations.',
    learningOutcomes: [
      'Write unambiguous user stories with clear acceptance criteria',
      'Define quantitative SLAs for latency, uptime, and throughput',
      'Prevent scope creep during sprint planning'
    ],
    technology: 'Requirements Engineering',
    difficulty: 'Beginner',
    readTime: '8 min read',
    url: 'https://www.agilealliance.org/glossary/user-stories/',
    isOfficialDoc: false,
  },
  {
    id: 'res-gs-03',
    title: 'Agile Alliance: User Stories & Acceptance Criteria Guide',
    category: 'Getting Started',
    type: 'Official Documentation',
    description: 'The definitive industry standard for structuring agile user stories, vertical slicing, and testable acceptance rules.',
    learningOutcomes: [
      'Understand the INVEST criteria for agile backlog items',
      'Break large epics into small, deliverable incremental iterations',
      'Write Given-When-Then behavioral specifications'
    ],
    technology: 'Agile Methodology',
    difficulty: 'Beginner',
    readTime: '10 min read',
    url: 'https://www.agilealliance.org/agile101/',
    isOfficialDoc: true,
  },
  {
    id: 'res-gs-04',
    title: 'StackMatch Project Inception & Architecture Blueprinting',
    category: 'Getting Started',
    type: 'StackMatch Guide',
    description: 'How to transition an initial idea through requirements breakdown, stack matching, and architecture generation in StackMatch.',
    learningOutcomes: [
      'Leverage AI discussion prompts to uncover hidden constraints',
      'Translate business requirements into tech stack tradeoffs',
      'Generate production-ready PDF blueprints for stakeholders'
    ],
    technology: 'StackMatch Workflow',
    difficulty: 'Beginner',
    readTime: '5 min read',
    url: 'https://github.com/manishvenki/stackmatch',
    isOfficialDoc: false,
    featured: true,
  },

  // 2. Technology Stack Guides
  {
    id: 'res-ts-01',
    title: 'React 19 Official Documentation & Core Architecture',
    category: 'Technology Stack Guides',
    type: 'Official Documentation',
    description: 'Comprehensive guide to modern React concepts: functional components, hooks, concurrent rendering, and server components.',
    learningOutcomes: [
      'Master hooks state management and lifecycle hooks',
      'Implement clean component separation and custom hooks',
      'Understand concurrent rendering and performance profiling'
    ],
    technology: 'React',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://react.dev',
    isOfficialDoc: true,
    featured: true,
  },
  {
    id: 'res-ts-02',
    title: 'Next.js App Router & Server Components Architecture',
    category: 'Technology Stack Guides',
    type: 'Official Documentation',
    description: 'The official Next.js handbook for building hybrid server-rendered and static web applications with nested layouts and streaming.',
    learningOutcomes: [
      'Architect fullstack applications with App Router directory layout',
      'Optimize bundle size using React Server Components',
      'Implement server actions for zero-API form mutations'
    ],
    technology: 'Next.js',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://nextjs.org/docs',
    isOfficialDoc: true,
  },
  {
    id: 'res-ts-03',
    title: 'Node.js & Express API Development Guide',
    category: 'Technology Stack Guides',
    type: 'Official Documentation',
    description: 'Official guides for building performant, non-blocking REST APIs, middleware pipelines, and event-driven asynchronous services.',
    learningOutcomes: [
      'Design modular middleware pipelines for auth and logging',
      'Handle asynchronous errors without crashing the process',
      'Manage environment configuration and connection pooling'
    ],
    technology: 'Node.js',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://nodejs.org/en/docs/guides',
    isOfficialDoc: true,
  },
  {
    id: 'res-ts-04',
    title: 'FastAPI Python Async Microservices & OpenAPI Standards',
    category: 'Technology Stack Guides',
    type: 'Official Documentation',
    description: 'High-performance Python web framework featuring automatic OpenAPI documentation, Pydantic type validation, and async I/O.',
    learningOutcomes: [
      'Leverage Python type hints for automatic validation',
      'Build asynchronous endpoints for machine learning integrations',
      'Auto-generate Swagger documentation for client SDKs'
    ],
    technology: 'FastAPI',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://fastapi.tiangolo.com',
    isOfficialDoc: true,
  },
  {
    id: 'res-ts-05',
    title: 'Vite: Next Generation Frontend Tooling',
    category: 'Technology Stack Guides',
    type: 'Official Documentation',
    description: 'Instant server start and lightning-fast HMR powered by native ES modules and Rollup production bundling.',
    learningOutcomes: [
      'Configure optimized build chunks and dynamic imports',
      'Setup TypeScript compilation with asset hashing',
      'Manage environment variables across development and staging'
    ],
    technology: 'Vite',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://vite.dev',
    isOfficialDoc: true,
  },

  // 3. Architecture & System Design
  {
    id: 'res-arch-01',
    title: 'System Design Primer: Scalable Web Architectures',
    category: 'Architecture & System Design',
    type: 'Checklist & Reference',
    description: 'A structured blueprint covering horizontal scaling, load balancing, caching tiers, data partitioning, and consistency models.',
    learningOutcomes: [
      'Analyze bottlenecks in client-server data flows',
      'Select between vertical and horizontal scaling models',
      'Apply CAP theorem trade-offs to distributed databases'
    ],
    technology: 'System Architecture',
    difficulty: 'Intermediate',
    readTime: 'Reference Guide',
    url: 'https://github.com/donnemartin/system-design-primer',
    isOfficialDoc: false,
    featured: true,
  },
  {
    id: 'res-arch-02',
    title: 'MDN Web Docs: HTTP Semantics, Status Codes & REST API Design',
    category: 'Architecture & System Design',
    type: 'Official Documentation',
    description: 'Standard HTTP methods, idempotent requests, caching headers, and status code conventions from Mozilla Developer Network.',
    learningOutcomes: [
      'Utilize correct HTTP status codes (200, 201, 400, 401, 403, 404, 409, 429)',
      'Design idempotent endpoints for payment and order mutations',
      'Configure cache-control, ETag, and CORS headers correctly'
    ],
    technology: 'HTTP & REST',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
    isOfficialDoc: true,
  },
  {
    id: 'res-arch-03',
    title: 'Layered Architecture Blueprint: Client, Gateway, Data & Workers',
    category: 'Architecture & System Design',
    type: 'Architecture Playbook',
    description: 'StackMatch architectural pattern for separating presentation logic, domain contracts, persistence layers, and async jobs.',
    learningOutcomes: [
      'Decouple frontend state from backend database schemas',
      'Implement asynchronous job queues for heavy background tasks',
      'Prevent cyclic dependencies in enterprise services'
    ],
    technology: 'Software Engineering',
    difficulty: 'Advanced',
    readTime: '7 min read',
    url: 'https://martinfowler.com/architecture/',
    isOfficialDoc: false,
  },
  {
    id: 'res-arch-04',
    title: 'Event-Driven vs. Request-Response Architecture Comparison',
    category: 'Architecture & System Design',
    type: 'StackMatch Guide',
    description: 'When to rely on synchronous REST/GraphQL calls versus publish-subscribe message brokers like Redis Pub/Sub, Kafka, or RabbitMQ.',
    learningOutcomes: [
      'Determine when synchronous HTTP creates cascading latency',
      'Design idempotent event consumers with retry backoff',
      'Avoid distributed transaction pitfalls in early-stage startups'
    ],
    technology: 'Distributed Systems',
    difficulty: 'Advanced',
    readTime: '9 min read',
    url: 'https://aws.amazon.com/event-driven-architecture/',
    isOfficialDoc: false,
  },

  // 4. Database Guides
  {
    id: 'res-db-01',
    title: 'PostgreSQL Official Documentation & Relational Modeling',
    category: 'Database Guides',
    type: 'Official Documentation',
    description: 'The world\'s most advanced open-source relational database: schemas, indexing, foreign keys, JSONB, and transaction isolation.',
    learningOutcomes: [
      'Design normalized 3NF relational schemas with strict foreign keys',
      'Optimize query performance using B-Tree and GIN indexes',
      'Safely store semi-structured attributes with JSONB columns'
    ],
    technology: 'PostgreSQL',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://www.postgresql.org/docs/',
    isOfficialDoc: true,
    featured: true,
  },
  {
    id: 'res-db-02',
    title: 'MongoDB Atlas Manual & Document Modeling Patterns',
    category: 'Database Guides',
    type: 'Official Documentation',
    description: 'Official MongoDB guide for schema design, embedding versus referencing, aggregation pipelines, and cloud cluster scaling.',
    learningOutcomes: [
      'Decide between embedding child documents and referencing ObjectIds',
      'Construct aggregation pipelines for statistical reporting',
      'Manage indexes, connection pooling, and replica sets'
    ],
    technology: 'MongoDB Atlas',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://www.mongodb.com/docs/manual/',
    isOfficialDoc: true,
  },
  {
    id: 'res-db-03',
    title: 'SQL vs. NoSQL: Practical Decision Matrix for Startups',
    category: 'Database Guides',
    type: 'StackMatch Guide',
    description: 'A clear rubric comparing schema rigidity, join performance, horizontal sharding, operational overhead, and developer velocity.',
    learningOutcomes: [
      'Select the right database engine based on data relationships and query patterns',
      'Avoid early architectural traps of premature polyglot persistence',
      'Evaluate managed cloud database pricing at scale'
    ],
    technology: 'Database Architecture',
    difficulty: 'Beginner',
    readTime: '6 min read',
    url: 'https://aws.amazon.com/nosql/',
    isOfficialDoc: false,
  },
  {
    id: 'res-db-04',
    title: 'Redis Documentation: In-Memory Caching & Session Stores',
    category: 'Database Guides',
    type: 'Official Documentation',
    description: 'High-speed in-memory data structures: strings, hashes, sets, rate limiters, pub/sub channels, and session caching.',
    learningOutcomes: [
      'Implement cache-aside pattern with TTL expiration policies',
      'Build atomic token bucket rate limiters for API endpoints',
      'Store scalable distributed user sessions across multi-instance servers'
    ],
    technology: 'Redis',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://redis.io/docs/latest/',
    isOfficialDoc: true,
  },

  // 5. DevOps & Deployment
  {
    id: 'res-ops-01',
    title: 'Docker Get Started: Containerization & Multi-Stage Builds',
    category: 'DevOps & Deployment',
    type: 'Official Documentation',
    description: 'Containerize frontend and backend applications with Docker: Dockerfile best practices, multi-stage slimming, and Docker Compose.',
    learningOutcomes: [
      'Write multi-stage Dockerfiles that reduce production image sizes by 80%',
      'Eliminate the "works on my machine" problem across team environments',
      'Orchestrate local multi-container development with Docker Compose'
    ],
    technology: 'Docker',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://docs.docker.com/get-started/',
    isOfficialDoc: true,
    featured: true,
  },
  {
    id: 'res-ops-02',
    title: 'GitHub Actions Documentation: CI/CD Pipeline Automation',
    category: 'DevOps & Deployment',
    type: 'Official Documentation',
    description: 'Automate build testing, linting, security audits, Docker image pushes, and deployment triggers directly from your git repository.',
    learningOutcomes: [
      'Write workflow YAML pipelines for automated pull request testing',
      'Securely inject repository secrets and deployment tokens',
      'Implement deployment protections and preview environments'
    ],
    technology: 'GitHub Actions',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://docs.github.com/en/actions',
    isOfficialDoc: true,
  },
  {
    id: 'res-ops-03',
    title: 'Vercel Deployment Documentation: Serverless & Edge Networking',
    category: 'DevOps & Deployment',
    type: 'Official Documentation',
    description: 'Deploy modern static web apps and serverless backend functions with global CDN edge routing and zero-configuration SSL.',
    learningOutcomes: [
      'Configure single-page app rewrites and serverless API endpoints',
      'Set up preview deployments for instant pull request verification',
      'Troubleshoot CORS headers, build limits, and environment variables'
    ],
    technology: 'Vercel',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://vercel.com/docs',
    isOfficialDoc: true,
  },
  {
    id: 'res-ops-04',
    title: 'The Twelve-Factor App Methodology for Cloud Applications',
    category: 'DevOps & Deployment',
    type: 'Checklist & Reference',
    description: 'The industry-wide gold standard principles for building portable, resilient, cloud-native software services.',
    learningOutcomes: [
      'Strict separation of config from codebase via environment variables',
      'Treat backing services as attached resources',
      'Execute app processes as stateless and share-nothing'
    ],
    technology: 'Cloud Infrastructure',
    difficulty: 'Intermediate',
    readTime: '12 min read',
    url: 'https://12factor.net',
    isOfficialDoc: true,
  },

  // 6. Project Planning
  {
    id: 'res-plan-01',
    title: 'Product Roadmap Milestones: From Idea to Production Launch',
    category: 'Project Planning',
    type: 'StackMatch Guide',
    description: 'Step-by-step strategy for organizing software development into discrete phases: Discovery, Architecture, Core MVP, Polish, and Release.',
    learningOutcomes: [
      'Structure milestones with clear deliverables and acceptance gates',
      'Track velocity without burdensome micro-management',
      'Identify blockers early before they impact critical release dates'
    ],
    technology: 'Project Management',
    difficulty: 'Beginner',
    readTime: '7 min read',
    url: 'https://www.atlassian.com/agile/product-management/product-roadmaps',
    isOfficialDoc: false,
    featured: true,
  },
  {
    id: 'res-plan-02',
    title: 'Technical Debt Prevention & Architecture Review Checklist',
    category: 'Project Planning',
    type: 'Architecture Playbook',
    description: 'A pre-launch verification audit checking test coverage, error handling boundaries, secret management, and logging sanitation.',
    learningOutcomes: [
      'Conduct effective peer architecture reviews before writing code',
      'Identify fragile dependencies and single points of failure',
      'Document architectural decision records (ADRs) for team clarity'
    ],
    technology: 'Architecture Governance',
    difficulty: 'Intermediate',
    readTime: '8 min read',
    url: 'https://adr.github.io',
    isOfficialDoc: false,
  },
  {
    id: 'res-plan-03',
    title: 'GitHub Projects: Planning and Tracking Development Workflows',
    category: 'Project Planning',
    type: 'Official Documentation',
    description: 'Official guide to organizing sprint boards, issue milestones, automated pull request linking, and team backlogs.',
    learningOutcomes: [
      'Create custom Kanban tables and sprint views',
      'Automate issue state transitions on branch merge',
      'Filter backlog by labels, priority, and assignees'
    ],
    technology: 'GitHub Projects',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://docs.github.com/en/issues/planning-and-tracking-with-projects',
    isOfficialDoc: true,
  },
  {
    id: 'res-plan-04',
    title: 'Estimating Engineering Timelines for Technical Founders',
    category: 'Project Planning',
    type: 'StackMatch Guide',
    description: 'How to calculate realistic engineering estimates using confidence intervals, buffer ratios, and third-party API dependency risks.',
    learningOutcomes: [
      'Calculate three-point estimation (optimistic, likely, pessimistic)',
      'Account for integration friction and external authentication approvals',
      'Communicate delivery expectations clearly with non-technical stakeholders'
    ],
    technology: 'Engineering Estimation',
    difficulty: 'Intermediate',
    readTime: '6 min read',
    url: 'https://en.wikipedia.org/wiki/Three-point_estimation',
    isOfficialDoc: false,
  },

  // 7. Security & Best Practices
  {
    id: 'res-sec-01',
    title: 'OWASP Top 10 Web Application Security Risks Reference',
    category: 'Security & Best Practices',
    type: 'Official Documentation',
    description: 'The globally recognized standard awareness document for developers: Broken Access Control, Injection, Cryptographic Failures, and SSRF.',
    learningOutcomes: [
      'Prevent SQL and NoSQL injection through parameterized queries',
      'Enforce role-based access control (RBAC) at every endpoint layer',
      'Mitigate cross-site scripting (XSS) and cross-site request forgery (CSRF)'
    ],
    technology: 'AppSec',
    difficulty: 'Intermediate',
    readTime: 'Official Reference',
    url: 'https://owasp.org/www-project-top-ten/',
    isOfficialDoc: true,
    featured: true,
  },
  {
    id: 'res-sec-02',
    title: 'JWT Authentication & Secure Session Storage Best Practices',
    category: 'Security & Best Practices',
    type: 'Checklist & Reference',
    description: 'How to safely implement JSON Web Tokens: signature validation, expiration lifespans, refresh token rotation, and HttpOnly cookies.',
    learningOutcomes: [
      'Choose between localStorage, sessionStorage, and HttpOnly Secure cookies',
      'Implement short-lived access tokens with secure refresh flows',
      'Avoid storing sensitive personally identifiable info (PII) inside JWT claims'
    ],
    technology: 'Authentication & JWT',
    difficulty: 'Intermediate',
    readTime: '10 min read',
    url: 'https://auth0.com/docs/secure',
    isOfficialDoc: true,
  },
  {
    id: 'res-sec-03',
    title: 'Environment Variables & Secrets Management in Production',
    category: 'Security & Best Practices',
    type: 'StackMatch Guide',
    description: 'Never commit secrets: how to manage `.env` files, production secrets injection, key rotation, and automated leak detection.',
    learningOutcomes: [
      'Configure `.gitignore` rules and automated git pre-commit secret scanners',
      'Distinguish public client keys from private backend secrets',
      'Manage credentials securely across staging, test, and production'
    ],
    technology: 'Secrets Management',
    difficulty: 'Beginner',
    readTime: '5 min read',
    url: 'https://12factor.net/config',
    isOfficialDoc: false,
  },
  {
    id: 'res-sec-04',
    title: 'MDN: Cross-Origin Resource Sharing (CORS) & Secure HTTP Headers',
    category: 'Security & Best Practices',
    type: 'Official Documentation',
    description: 'A deep dive into browser same-origin policy, preflight OPTIONS requests, allowed origins, and Content-Security-Policy (CSP).',
    learningOutcomes: [
      'Properly configure CORS headers without relying on dangerous wildcard `*` with credentials',
      'Understand how browsers validate Access-Control-Allow-Origin',
      'Implement security headers including X-Content-Type-Options and Strict-Transport-Security'
    ],
    technology: 'Web Security & CORS',
    difficulty: 'Intermediate',
    readTime: 'Official Docs',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
    isOfficialDoc: true,
  },

  // 8. Useful Tools
  {
    id: 'res-tool-01',
    title: 'TypeScript Official Handbook & Strict Mode Guide',
    category: 'Useful Tools',
    type: 'Official Documentation',
    description: 'The official TypeScript guide to static typing, interfaces, generics, union types, utility types, and strict compiler settings.',
    learningOutcomes: [
      'Catch type mismatch errors at compile time before production runtime',
      'Write reusable generic functions and interface contracts',
      'Configure `strict: true` for enterprise-grade type safety'
    ],
    technology: 'TypeScript',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://www.typescriptlang.org/docs/',
    isOfficialDoc: true,
    featured: true,
  },
  {
    id: 'res-tool-02',
    title: 'Postman API Platform & Automated Collection Testing',
    category: 'Useful Tools',
    type: 'Official Documentation',
    description: 'Design, test, mock, and document REST APIs with Postman collections, environment variables, and pre-request scripts.',
    learningOutcomes: [
      'Create reusable API collections for team collaboration',
      'Write automated JavaScript assertions for response status and schema',
      'Generate team documentation and mock servers for frontend development'
    ],
    technology: 'Postman',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://learning.postman.com/docs/',
    isOfficialDoc: true,
  },
  {
    id: 'res-tool-03',
    title: 'Tailwind CSS Modern Utility-First Styling Framework',
    category: 'Useful Tools',
    type: 'Official Documentation',
    description: 'Rapidly build modern user interfaces with utility-first CSS classes, responsive breakpoints, and dark mode configuration.',
    learningOutcomes: [
      'Design responsive layouts without writing hundreds of custom CSS classes',
      'Maintain design consistency via design token theme extensions',
      'Optimize CSS bundle size with automated JIT purging'
    ],
    technology: 'Tailwind CSS',
    difficulty: 'Beginner',
    readTime: 'Official Docs',
    url: 'https://tailwindcss.com/docs',
    isOfficialDoc: true,
  },
  {
    id: 'res-tool-04',
    title: 'dbdiagram.io: Database Relationship Visualizer & ERD Designer',
    category: 'Useful Tools',
    type: 'Checklist & Reference',
    description: 'Free, quick web tool to turn declarative DBML code into clean entity-relationship diagrams for architectural reviews.',
    learningOutcomes: [
      'Model relational entity relationships visually before running database migrations',
      'Export SQL DDL schema scripts for PostgreSQL and MySQL',
      'Embed interactive ER diagrams in project documentation'
    ],
    technology: 'Data Modeling Tools',
    difficulty: 'Beginner',
    readTime: 'Interactive Tool',
    url: 'https://dbdiagram.io',
    isOfficialDoc: false,
  },
];
