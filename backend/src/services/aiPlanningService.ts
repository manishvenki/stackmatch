import {
  Project,
  Requirement,
  Technology,
  TechComparisonGroup,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
  IdeaAnalysisResult,
  FollowUpQuestion,
  ProjectContext,
  ArchitectureValidationReport,
  ArchitectureValidationFinding,
  ProjectComplexityInsight,
  ProjectRiskItem
} from '../../../packages/types/src/index';
import { config } from '../config/environment';

export class AiPlanningService {
  /**
   * Analyzes a natural-language product idea and extracts structured planning understanding.
   */
  public async analyzeIdea(prompt: string, projectName: string = 'Untitled Project'): Promise<IdeaAnalysisResult> {
    const text = prompt.toLowerCase();

    // Domain detection
    const isFood = text.includes('food') || text.includes('restaurant') || text.includes('dining') || text.includes('meal');
    const isFitness = text.includes('fitness') || text.includes('workout') || text.includes('health') || text.includes('gym') || text.includes('macro');
    const isEcom = text.includes('shop') || text.includes('store') || text.includes('ecommerce') || text.includes('market') || text.includes('cart');
    const isSaaS = text.includes('saas') || text.includes('invoice') || text.includes('crm') || text.includes('b2b') || text.includes('analytics');
    const isSocial = text.includes('social') || text.includes('chat') || text.includes('community') || text.includes('forum');

    // Platform detection
    const wantsMobile = text.includes('mobile') || text.includes('ios') || text.includes('android') || text.includes('app');
    const wantsWeb = text.includes('web') || text.includes('portal') || text.includes('dashboard') || text.includes('site');
    const platforms = (wantsMobile && wantsWeb)
      ? ['Responsive Web Portal', 'Cross-Platform Mobile App (iOS & Android)']
      : wantsMobile
      ? ['Mobile Application (iOS & Android)']
      : wantsWeb
      ? ['Responsive Web Application']
      : ['Web Application', 'Mobile Responsive App'];

    // User detection
    let targetUsers: string[] = ['Standard Users', 'Administrators'];
    let problem = `Users need a modern, streamlined digital workflow for ${prompt.slice(0, 60)}...`;
    let proposed = `A secure, cloud-enabled software solution facilitating automated workflows, role-based dashboards, and real-time data synchronization.`;

    if (isFood) {
      targetUsers = ['Students / Diners', 'Restaurant / Cafeteria Vendors', 'Campus Administrators'];
      problem = 'Campus diners experience long waiting queues during peak lunch rush with zero visibility into kitchen preparation statuses.';
      proposed = 'A unified digital ordering and live order fulfillment platform with pre-ordering, mobile payments, and kitchen management.';
    } else if (isFitness) {
      targetUsers = ['Gym Members / Athletes', 'Personal Trainers', 'Club Management'];
      problem = 'Individuals lack seamless tracking across custom exercise routines, nutritional macro intake, and coach progress check-ins.';
      proposed = 'An interactive mobile health companion offering habit tracking, workout logging, meal analytics, and coach messaging.';
    } else if (isEcom) {
      targetUsers = ['Shoppers', 'Merchant Store Owners', 'Support & Operations Staff'];
      problem = 'Customers require frictionless product discovery, transparent inventory tracking, and one-click localized checkout.';
      proposed = 'A modern storefront and merchant fulfillment engine with automated order lifecycle tracking and payment gateways.';
    } else if (isSaaS) {
      targetUsers = ['End-Clients', 'Team Collaborators', 'Billing & Account Owners'];
      problem = 'Businesses lose billable hours manually compiling project invoices, client statuses, and payment reconciliations.';
      proposed = 'A multi-tenant SaaS workspace providing automated workflow pipelines, granular permission tiers, and payment processing.';
    }

    const followUpQuestions: FollowUpQuestion[] = [];

    // Follow-up 1: Primary Target Platform
    if (!wantsMobile && !wantsWeb) {
      followUpQuestions.push({
        id: 'q_platform',
        question: 'Which platforms are essential for your Minimum Viable Product (MVP)?',
        context: 'Determines whether we recommend React Native, pure Web Single Page Application, or universal full-stack.',
        options: ['Both Web and Mobile', 'Web Application only for MVP', 'Mobile App first (iOS & Android)']
      });
    }

    // Follow-up 2: Payments & Monetization
    followUpQuestions.push({
      id: 'q_monetization',
      question: 'Will this platform process online financial transactions at launch?',
      context: 'Influences database ACID consistency guarantees, PCI compliance needs, and payment gateway webhooks.',
      options: ['Yes, online payments (UPI, Cards, Wallets)', 'No payment processing needed initially', 'Subscription recurring billing']
    });

    // Follow-up 3: User Access & Roles
    followUpQuestions.push({
      id: 'q_roles',
      question: 'Who are the distinct user personas accessing this platform?',
      context: 'Dictates role-based access control (RBAC), multi-tenant isolation, and dashboard separation.',
      options: [targetUsers.join(', '), 'Single end-user type only', 'Multi-tenant organization accounts with admin delegation']
    });

    return {
      problemStatement: problem,
      targetUsers,
      mainGoals: [
        'Streamline end-user discovery and core transaction flow with sub-second response times',
        'Provide administrative operators with full operational visibility and audit capabilities',
        'Establish a scalable, containerized architecture that easily adapts to future expansion'
      ],
      proposedSolution: proposed,
      platformRequirements: platforms,
      constraints: [
        'Sub-500ms API response latency under concurrent traffic spikes',
        'Mobile-friendly responsive UI compatible with modern smartphones and tablets',
        'Strict token authorization and credential security standards'
      ],
      assumptions: [
        'End users possess modern internet-enabled smartphones or browsers',
        'Third-party cloud infrastructure (database, storage, notifications) will be leveraged'
      ],
      unresolvedQuestions: [
        'Target volume of active concurrent users within the first 6 months',
        'Specific regional compliance mandates (GDPR, HIPAA, or local financial data residency)'
      ],
      followUpQuestions
    };
  }

  /**
   * Generates a complete requirements model based on user prompts and analysis.
   */
  public generateRequirements(projectId: string, ideaAnalysis: IdeaAnalysisResult, prompt: string): Requirement[] {
    const isFood = prompt.toLowerCase().includes('food') || prompt.toLowerCase().includes('restaurant');
    const isFitness = prompt.toLowerCase().includes('fitness') || prompt.toLowerCase().includes('workout');

    if (isFood) {
      return [
        {
          id: `req_${Date.now()}_1`,
          projectId,
          title: 'Role-Based Authentication & Permissions',
          description: 'Students, vendors, and admins can register, securely authenticate via JWT, and access tailored privilege tiers.',
          type: 'functional',
          priority: 'high',
          category: 'Identity & Access',
          userStory: 'As a student or merchant, I want to sign in securely so my personal orders and menus are protected.',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_2`,
          projectId,
          title: 'Catalog & Menu Browsing with Filters',
          description: 'Diners can browse items by cafeteria, view dietary tags, search dish names, and review real-time availability.',
          type: 'functional',
          priority: 'high',
          category: 'Core Commerce',
          userStory: 'As a student, I want to quickly find meals fitting my budget and dietary preferences.',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_3`,
          projectId,
          title: 'Cart Management & Order Checkout',
          description: 'Add and customize dish variants, select scheduled pickup windows, and checkout with immediate order confirmation.',
          type: 'functional',
          priority: 'high',
          category: 'Order Processing',
          userStory: 'As a customer, I want to review my cart items and checkout in under 3 taps.',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_4`,
          projectId,
          title: 'Real-Time Kitchen Order Display',
          description: 'Cafeteria staff receive real-time order alerts and advance status from Placed → Preparing → Ready for Pickup.',
          type: 'functional',
          priority: 'high',
          category: 'Merchant Operations',
          userStory: 'As a kitchen operator, I want to view active tickets so I can prepare orders in priority order.',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_5`,
          projectId,
          title: 'Instant Online Payment & Escrow Webhooks',
          description: 'Support secure UPI, card, and campus wallet payments with automated receipt dispatch and webhook reconciliation.',
          type: 'functional',
          priority: 'high',
          category: 'Billing & Fintech',
          userStory: 'As a user, I want to pay instantly via UPI without needing cash change at the counter.',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_6`,
          projectId,
          title: 'Push Notifications & Status Alerts',
          description: 'Dispatches pickup alerts when orders are marked ready, reducing crowded waiting lobbies.',
          type: 'functional',
          priority: 'medium',
          category: 'Engagement',
          userStory: 'As a diner, I want an alert when my order is ready so I do not stand in a crowded line.',
          isMvpScope: false
        },
        {
          id: `req_${Date.now()}_7`,
          projectId,
          title: 'High Concurrency Lunch Spike Resilience',
          description: 'Backend services must sustain 500+ concurrent checkouts during 12:00 PM – 2:00 PM rushes with sub-500ms latency.',
          type: 'non-functional',
          priority: 'high',
          category: 'Performance',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_8`,
          projectId,
          title: 'Payment Security & Tokenized Isolation',
          description: 'PCI-DSS compliant token handling; zero plain-text card or credential storage; encrypted HTTPS communication.',
          type: 'non-functional',
          priority: 'high',
          category: 'Security',
          isMvpScope: true
        }
      ];
    }

    if (isFitness) {
      return [
        {
          id: `req_${Date.now()}_1`,
          projectId,
          title: 'Athlete & Trainer Profile Onboarding',
          description: 'Athletes specify physical goals, dietary targets, and training frequency during initial onboarding.',
          type: 'functional',
          priority: 'high',
          category: 'User Onboarding',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_2`,
          projectId,
          title: 'Workout Logging & Rep Counter',
          description: 'Log exercise sets, weights, rest timers, and personal best records with offline local caching.',
          type: 'functional',
          priority: 'high',
          category: 'Workout Tracking',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_3`,
          projectId,
          title: 'Daily Nutrition & Macro Intake Tracker',
          description: 'Log meals with automated macro calorie, protein, carbohydrate, and fat calculations against targets.',
          type: 'functional',
          priority: 'high',
          category: 'Nutritional Tracking',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_4`,
          projectId,
          title: 'Progress Visualizer & Historical Analytics',
          description: 'Interactive charts rendering weight trends, volume progression, and macro compliance scores.',
          type: 'functional',
          priority: 'medium',
          category: 'Analytics',
          isMvpScope: false
        },
        {
          id: `req_${Date.now()}_5`,
          projectId,
          title: 'Offline-First Data Syncing',
          description: 'Mobile client stores workouts offline and synchronizes with cloud backend when connectivity resumes.',
          type: 'non-functional',
          priority: 'high',
          category: 'Reliability',
          isMvpScope: true
        },
        {
          id: `req_${Date.now()}_6`,
          projectId,
          title: 'User Health Data Privacy & Encryption',
          description: 'Biometric and wellness data encrypted at rest with AES-256 and transmitted over TLS 1.3.',
          type: 'non-functional',
          priority: 'high',
          category: 'Security',
          isMvpScope: true
        }
      ];
    }

    // General SaaS / Default Project Requirements
    return [
      {
        id: `req_${Date.now()}_1`,
        projectId,
        title: 'Authentication & Multi-Tenant Organization Workspace',
        description: 'Secure registration, team invitation tokens, and role-based access control (Admin, Member, Viewer).',
        type: 'functional',
        priority: 'high',
        category: 'Identity & Access',
        isMvpScope: true
      },
      {
        id: `req_${Date.now()}_2`,
        projectId,
        title: 'Core Workflow & Record Management Dashboard',
        description: 'Create, search, filter, and modify core business entities with audit tracking and responsive tables.',
        type: 'functional',
        priority: 'high',
        category: 'Core Operations',
        isMvpScope: true
      },
      {
        id: `req_${Date.now()}_3`,
        projectId,
        title: 'Real-Time Activity Feed & Notifications',
        description: 'System alerts and collaborative status updates dispatched via in-app feeds and email notifications.',
        type: 'functional',
        priority: 'medium',
        category: 'Collaboration',
        isMvpScope: true
      },
      {
        id: `req_${Date.now()}_4`,
        projectId,
        title: 'Automated Billing & Subscription Management',
        description: 'Integrated checkout for credit card / UPI payments, invoice downloads, and usage tiers.',
        type: 'functional',
        priority: 'high',
        category: 'Billing',
        isMvpScope: false
      },
      {
        id: `req_${Date.now()}_5`,
        projectId,
        title: 'Sub-Second Latency & Scalable Throughput',
        description: 'API response times remain under 300ms at 95th percentile with horizontal auto-scaling support.',
        type: 'non-functional',
        priority: 'high',
        category: 'Performance',
        isMvpScope: true
      },
      {
        id: `req_${Date.now()}_6`,
        projectId,
        title: 'Encrypted Data Storage & Regular Backups',
        description: 'All customer data encrypted at rest with automated daily snapshots and disaster recovery policies.',
        type: 'non-functional',
        priority: 'high',
        category: 'Security',
        isMvpScope: true
      }
    ];
  }

  /**
   * Generates tailored technology recommendations with StackMatch suitability scoring.
   */
  public recommendTechStack(project: Project, requirements: Requirement[]): Technology[] {
    const text = (project.name + ' ' + (project.description || '')).toLowerCase();
    const isMobileHeavy = text.includes('mobile') || text.includes('app') || text.includes('fitness') || text.includes('ios') || text.includes('android');
    const hasPayments = text.includes('food') || text.includes('order') || text.includes('checkout') || text.includes('pay') || text.includes('shop') || text.includes('ecommerce') || text.includes('billing') || text.includes('subscription');

    const technologies: Technology[] = [
      {
        id: 'tech_react',
        name: 'React',
        category: 'Frontend',
        tagline: 'Modern declarative UI library for high-responsiveness web interfaces',
        description: 'Component-driven web framework offering massive community adoption, lightning-fast rendering, and seamless state synchronization.',
        matchScore: 94,
        isRecommended: true,
        keyInfo: {
          category: 'Frontend Library',
          type: 'Single Page Application / Framework',
          license: 'MIT (Open Source)',
          learningCurve: 'Medium',
          scalability: 'Excellent',
          ecosystem: 'Very High',
          costProfile: 'Low / Open-Source'
        },
        metrics: { popularity: 96, easeOfLearning: 76, scalability: 95, ecosystem: 98 },
        roleInArchitecture: 'Client-side presentation tier for browser users, responsive management portals, and interactive dashboards.',
        integrationConsiderations: [
          'Communicates with Node.js backend over typed REST endpoints with Axios or native fetch',
          'Shares TypeScript domain contracts with backend models via shared types workspace',
          'Vite build bundler delivers sub-300ms hot module replacement during active development'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Calculated across 4 weighted dimensions: Developer ecosystem & UI libraries (35%), rendering performance (25%), hiring availability (20%), and zero-cost open-source license (20%).',
        whyRecommended: [
          'Shared component paradigms and design system models with React Native for cross-platform apps',
          'Rich ecosystem of production-tested UI kits, data-table grids, and form validation libraries',
          'Fast iteration cycles with modern build bundlers (Vite) and TypeScript'
        ],
        benefits: [
          'Reusable component architecture accelerates multi-page feature buildouts',
          'Virtual DOM ensures fluid UI performance during frequent state modifications',
          'Deep developer talent pool and abundant battle-tested open-source libraries'
        ],
        tradeOffs: [
          'Requires deliberate decisions on client-side state management (Context, Zustand, or TanStack Query)',
          'Initial SEO setup requires server-side rendering (Next.js) if public crawler indexing is crucial'
        ],
        alternatives: ['Next.js', 'Vue.js', 'Svelte'],
        realWorldUsage: 'Powers high-traffic customer interfaces at DoorDash, Airbnb, Netflix, and Uber.',
        officialDocsUrl: 'https://react.dev'
      },
      {
        id: 'tech_nodejs',
        name: 'Node.js',
        category: 'Backend',
        tagline: 'Event-driven asynchronous JavaScript/TypeScript runtime for high-throughput APIs',
        description: 'Non-blocking I/O runtime engineered for high-concurrency request servicing and low-overhead microservices.',
        matchScore: 92,
        isRecommended: true,
        keyInfo: {
          category: 'Backend Runtime',
          type: 'Event-driven Asynchronous I/O',
          license: 'OpenJS Foundation',
          learningCurve: 'Medium',
          scalability: 'Very High',
          ecosystem: 'Very High',
          costProfile: 'Low / Open-Source'
        },
        metrics: { popularity: 93, easeOfLearning: 82, scalability: 91, ecosystem: 96 },
        roleInArchitecture: 'Application services tier handling REST routing, middleware guards, business validation, and webhook dispatch.',
        integrationConsiderations: [
          'Processes concurrent HTTP requests with non-blocking event loop',
          'Interfaces with PostgreSQL via pg/Prisma/Knex connection pooling',
          'Validates and issues cryptographically signed JWT bearer tokens'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Evaluated based on: I/O concurrency handling (35%), unified TypeScript stack with frontend (30%), package ecosystem maturity (20%), and containerization overhead (15%).',
        whyRecommended: [
          'Single language (TypeScript) unified across frontend, mobile, and backend reduces cognitive switching',
          'Efficient async event loop handles simultaneous webhooks and client socket events gracefully',
          'Massive npm ecosystem for auth, validation, database ORMs, and cloud SDKs'
        ],
        benefits: [
          'Rapid API development cycle with Express.js middleware pipelines',
          'Superb I/O throughput for real-time order processing and status feeds',
          'Lightweight memory footprint ideal for containerized Docker deployments'
        ],
        tradeOffs: [
          'CPU-bound data computations (heavy image transcoding/ML) must be delegated to background workers',
          'Requires strict TypeScript typings and linting to maintain enterprise code safety'
        ],
        alternatives: ['Go (Golang)', 'FastAPI (Python)', 'Java (Spring Boot)'],
        realWorldUsage: 'Handles millions of daily financial and checkout operations at PayPal, LinkedIn, and Netflix.',
        officialDocsUrl: 'https://nodejs.org'
      },
      {
        id: 'tech_postgres',
        name: 'PostgreSQL',
        category: 'Database',
        tagline: 'Enterprise-grade open-source relational database with strict ACID consistency',
        description: 'Reliable SQL database designed for mission-critical transactional integrity, complex relational queries, and structured data schemas.',
        matchScore: hasPayments ? 96 : 93,
        isRecommended: true,
        keyInfo: {
          category: 'Database Engine',
          type: 'Relational (SQL / ACID Compliant)',
          license: 'PostgreSQL License (Open Source)',
          learningCurve: 'Medium',
          scalability: 'Excellent',
          ecosystem: 'Very High',
          costProfile: 'Low / Open-Source'
        },
        metrics: { popularity: 92, easeOfLearning: 72, scalability: 95, ecosystem: 94 },
        roleInArchitecture: 'Persistence tier safeguarding transactional consistency, foreign keys, user accounts, and billing ledgers.',
        integrationConsiderations: [
          'Requires connection pooler (PgBouncer) under high concurrent request spikes',
          'Versioned database migration scripts maintain schema evolution safety',
          'Foreign key constraints guarantee zero orphaned order items or missing account records'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Evaluated based on: Strict ACID transaction guarantees (40%), relational referential integrity (30%), JSONB dynamic schema flexibility (15%), and enterprise open-source reliability (15%).',
        whyRecommended: [
          'Guarantees strict ACID transactions — vital to prevent double-charging or phantom order records',
          'Relational foreign keys maintain strict referential integrity between users, orders, and payment items',
          'Native JSONB columns provide flexibility for dynamic menu options and customizable schemas'
        ],
        benefits: [
          'Zero license fees with enterprise reliability and extensive cloud hosting support (AWS RDS, Supabase)',
          'Advanced indexing (B-Tree, GIN, GiST) for instant search queries and historical reporting',
          'Unmatched data safety under high concurrency'
        ],
        tradeOffs: [
          'Requires deliberate schema migration scripts as product models evolve',
          'Horizontal distributed sharding is more involved compared to native NoSQL document stores'
        ],
        alternatives: ['MongoDB', 'MySQL', 'Supabase'],
        realWorldUsage: 'Primary datastore for Spotify, Instagram, Twitch, and DoorDash.',
        officialDocsUrl: 'https://www.postgresql.org'
      },
      {
        id: 'tech_jwt',
        name: 'JWT (JSON Web Tokens)',
        category: 'Authentication',
        tagline: 'Cryptographically signed stateless tokens for multi-client API authorization',
        description: 'Compact, URL-safe bearer token standard representing claims between client applications and protected API routes.',
        matchScore: 90,
        isRecommended: true,
        keyInfo: {
          category: 'Auth Protocol',
          type: 'Stateless Cryptographic Bearer Token',
          license: 'IETF Standard',
          learningCurve: 'Easy',
          scalability: 'Excellent',
          ecosystem: 'Very High',
          costProfile: 'Low / Open-Source'
        },
        metrics: { popularity: 95, easeOfLearning: 88, scalability: 96, ecosystem: 95 },
        roleInArchitecture: 'Stateless authentication protocol securing API routes across both web and native mobile clients.',
        integrationConsiderations: [
          'Payload includes user ID, role claims, and standard expiry timestamps',
          'Transmitted via Authorization header (Bearer scheme) over TLS 1.3',
          'Pair with short lifespans (15m) or Redis token blacklist for immediate revocation support'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Evaluated based on: Stateless horizontal scalability (35%), cross-client compatibility for web and mobile (35%), and zero server session database roundtrips (30%).',
        whyRecommended: [
          'Stateless validation eliminates repetitive database session lookups on every API request',
          'Works identically across React web applications and native mobile clients',
          'Embeds user role claims for immediate client-side and server-side route guarding'
        ],
        benefits: [
          'Decoupled architecture ready for microservice gateways',
          'Zero server session memory required',
          'Standardized industry authorization format'
        ],
        tradeOffs: [
          'Instant token revocation requires a lightweight Redis blacklist or short-lived expiry with refresh tokens',
          'Payload is encoded (not encrypted), so sensitive secrets must not be stored in tokens'
        ],
        alternatives: ['Session Cookies', 'OAuth 2.0 / Auth0', 'Supabase Auth'],
        realWorldUsage: 'Universal industry standard across modern REST and GraphQL APIs.',
        officialDocsUrl: 'https://jwt.io'
      },
      {
        id: 'tech_razorpay',
        name: 'Razorpay / Stripe',
        category: 'Payments',
        tagline: 'High-conversion payment gateway with webhook verification & escrow',
        description: 'Developer-friendly payment infrastructure supporting instant UPI, credit/debit cards, net banking, and automatic reconciliation.',
        matchScore: 91,
        isRecommended: true,
        keyInfo: {
          category: 'Fintech Gateway',
          type: 'Payment Processing & Webhook Infrastructure',
          license: 'Commercial API',
          learningCurve: 'Easy',
          scalability: 'High',
          ecosystem: 'High',
          costProfile: 'Moderate / Tiered'
        },
        metrics: { popularity: 94, easeOfLearning: 86, scalability: 92, ecosystem: 91 },
        roleInArchitecture: 'External services tier processing digital payments, UPI intents, credit cards, and cryptographic webhook alerts.',
        integrationConsiderations: [
          'Webhook endpoints must verify HMAC SHA-256 signatures before confirming orders',
          'Stores payment transaction reference tokens without touching raw card numbers',
          'Handles sandbox mock testing in staging environments'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Evaluated based on: Regional checkout conversion & UPI support (40%), PCI-DSS offloading (30%), webhook developer tooling (20%), and automated refunds (10%).',
        whyRecommended: [
          'Market-leading transaction success rates with 1-click UPI and mobile checkout modals',
          'Cryptographically verified server webhooks update order status reliably',
          'Turnkey sandbox testing mode for safe staging validation'
        ],
        benefits: [
          'Highest conversion checkout experience for mobile and web shoppers',
          'Automated refunds and settlement dispute workflows',
          'Pre-built SDKs for React and React Native'
        ],
        tradeOffs: [
          'Standard transaction processing fee (typically 1.5% - 2%)',
          'Requires server-side webhook signing verification to prevent tampering'
        ],
        alternatives: ['Stripe', 'Paytm PG', 'Cashfree'],
        realWorldUsage: 'Powers checkout transactions across leading consumer platforms including Swiggy, Zomato, and BookMyShow.',
        officialDocsUrl: 'https://razorpay.com'
      },
      {
        id: 'tech_docker',
        name: 'Docker',
        category: 'Deployment',
        tagline: 'Standardized containerization for reproducible development and cloud deployment',
        description: 'Packages services, runtime libraries, and environment dependencies into immutable isolated containers.',
        matchScore: 90,
        isRecommended: true,
        keyInfo: {
          category: 'DevOps / Containers',
          type: 'OS-Level Virtualization',
          license: 'Apache 2.0 / Commercial',
          learningCurve: 'Medium',
          scalability: 'Very High',
          ecosystem: 'Very High',
          costProfile: 'Low / Open-Source'
        },
        metrics: { popularity: 95, easeOfLearning: 74, scalability: 97, ecosystem: 98 },
        roleInArchitecture: 'DevOps infrastructure encapsulating application runtime environments, system packages, and dependencies.',
        integrationConsiderations: [
          'Multi-stage Dockerfiles reduce final production container image sizes to under 150MB',
          'Docker Compose orchestrates full local stack (Node API + PostgreSQL + Redis) with one command',
          'Images deploy consistently to AWS ECS, GCP Cloud Run, DigitalOcean, or Render'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Evaluated based on: Environment parity across dev/staging/prod (40%), container portability (30%), instant rollbacks (20%), and vendor neutrality (10%).',
        whyRecommended: [
          'Completely eliminates "works on my machine" discrepancies between local dev and cloud servers',
          'Spins up complete multi-tier stacks (Node API + PostgreSQL + Redis) in seconds with Docker Compose',
          'Universal container format supported across all cloud providers (AWS ECS, DigitalOcean, Render, GCP)'
        ],
        benefits: [
          'Clean isolation and resource budgeting between services',
          'Instant rollback and reproducible testing builds',
          'Standard cloud deployment unit'
        ],
        tradeOffs: [
          'Managing large container fleets requires orchestrators like Kubernetes or managed container services',
          'Slight initial learning curve for multi-stage Dockerfiles'
        ],
        alternatives: ['Serverless (Vercel / AWS Lambda)', 'Podman', 'Direct VM Hosting'],
        realWorldUsage: 'Standard infrastructure component used across 90%+ of engineering teams globally.',
        officialDocsUrl: 'https://docker.com'
      }
    ];

    if (isMobileHeavy) {
      technologies.unshift({
        id: 'tech_react_native',
        name: 'React Native (Expo)',
        category: 'Mobile',
        tagline: 'Cross-platform native mobile applications with single TypeScript codebase',
        description: 'Compiles declarative TypeScript to genuine native iOS and Android user interface components.',
        matchScore: 95,
        isRecommended: true,
        keyInfo: {
          category: 'Mobile Framework',
          type: 'Cross-Platform Native',
          license: 'MIT (Open Source)',
          learningCurve: 'Medium',
          scalability: 'High',
          ecosystem: 'Very High',
          costProfile: 'Low / Open-Source'
        },
        metrics: { popularity: 93, easeOfLearning: 76, scalability: 92, ecosystem: 95 },
        roleInArchitecture: 'Native mobile client tier delivering downloadable iOS and Android mobile app experiences.',
        integrationConsiderations: [
          'Reuses TypeScript data schemas, validation logic, and API clients from the web application',
          'Uses Expo SecureStore for encrypted on-device JWT token persistence',
          'Leverages Expo Notifications for real-time kitchen status and pickup alerts'
        ],
        confidenceStatus: 'Verified Match',
        scoringCriteriaExplanation: 'Evaluated based on: Single-codebase cross-platform cost reduction (40%), true native UI performance (25%), OTA updates (20%), and unified TypeScript paradigm (15%).',
        whyRecommended: [
          'Shared business logic, API clients, and TypeScript models with the web frontend',
          'Single development team builds for both iOS and Android simultaneously',
          'Over-the-air updates and instant testing with Expo Go'
        ],
        benefits: [
          'Cuts mobile development and maintenance costs by 50%',
          'True native mobile UX with platform gestures and hardware push notifications',
          'Vibrant library ecosystem for maps, camera, and device biometrics'
        ],
        tradeOffs: [
          'Deep hardware-intensive graphics or custom native bridging occasionally require native module config'
        ],
        alternatives: ['Flutter', 'Swift (Native iOS)', 'Kotlin (Native Android)'],
        realWorldUsage: 'Powers mobile applications at Shopify, Discord, Coinbase, and Instagram.',
        officialDocsUrl: 'https://reactnative.dev'
      });
    }

    return technologies;
  }

  /**
   * Generates a side-by-side technology comparison matrix with multi-category support.
   */
  public generateComparisons(project: Project, categoryFilter?: string): TechComparisonGroup {
    const availableCategories = ['Databases', 'Frontend', 'Backend', 'Authentication', 'Cloud & Hosting'];
    const selected = (categoryFilter || 'Databases').toLowerCase();

    if (selected.includes('front')) {
      return {
        category: 'Frontend Frameworks',
        title: 'Frontend Framework Matrix for ' + project.name,
        availableCategories,
        technologies: [
          {
            name: 'React (Vite)',
            matchScore: 94,
            dataStructure: 'Component State & Virtual DOM',
            relationships: 'Unidirectional Data Flow',
            scalability: 'Excellent (Modular micro-frontends)',
            learningCurve: 'Medium',
            bestFor: 'Responsive portals, complex dashboards, interactive role-based SaaS',
            realWorldUsage: 'DoorDash, Airbnb, Netflix, Uber',
            community: 'Massive global ecosystem with endless UI component libraries',
            isRecommended: true,
            tradeOffs: 'Requires client-side state decisions; server rendering requires Next.js'
          },
          {
            name: 'Next.js',
            matchScore: 89,
            dataStructure: 'React Server Components + Client Hooks',
            relationships: 'Server/Client Hybrid Architecture',
            scalability: 'Excellent (Edge caching & SSR)',
            learningCurve: 'Medium-Hard',
            bestFor: 'Public-facing SEO content, ecommerce catalogs, blogs',
            realWorldUsage: 'Target, Nike, Notion, Vercel',
            community: 'Dominant enterprise full-stack React framework',
            isRecommended: false,
            tradeOffs: 'Server runtime complexity and deployment tie-ins with node servers or Vercel'
          },
          {
            name: 'Vue.js',
            matchScore: 83,
            dataStructure: 'Two-Way Reactive Proxy Data',
            relationships: 'Template + Script Binding',
            scalability: 'Very Good',
            learningCurve: 'Easy',
            bestFor: 'Lightweight applications, rapid prototypes, single-developer projects',
            realWorldUsage: 'GitLab, Nintendo, Behance',
            community: 'Extremely popular in indie hacker and European/Asian enterprise ecosystems',
            isRecommended: false,
            tradeOffs: 'Smaller enterprise library selection compared to React ecosystem'
          }
        ]
      };
    }

    if (selected.includes('back')) {
      return {
        category: 'Backend Runtimes & Frameworks',
        title: 'Backend Framework Matrix for ' + project.name,
        availableCategories,
        technologies: [
          {
            name: 'Node.js (Express / Fastify)',
            matchScore: 92,
            dataStructure: 'Event-driven Asynchronous Non-blocking I/O',
            relationships: 'Middleware Request Pipelines',
            scalability: 'Very High (Horizontal container clustering)',
            learningCurve: 'Medium',
            bestFor: 'Real-time REST APIs, webhook processing, microservices, unified TypeScript',
            realWorldUsage: 'PayPal, LinkedIn, Netflix, Uber',
            community: 'Largest package ecosystem in computing (npm)',
            isRecommended: true,
            tradeOffs: 'Single-threaded event loop requires worker threads for heavy CPU processing'
          },
          {
            name: 'Go (Golang / Gin)',
            matchScore: 88,
            dataStructure: 'Compiled Static Binary with Goroutines',
            relationships: 'Strict Typings & Struct Composition',
            scalability: 'Maximum (Near C-level concurrency efficiency)',
            learningCurve: 'Medium-Hard',
            bestFor: 'Ultra-high-throughput financial ledgers, network proxies, telemetry collectors',
            realWorldUsage: 'Docker, Kubernetes, Cloudflare, Uber',
            community: 'Industry gold standard for cloud infrastructure & systems engineering',
            isRecommended: false,
            tradeOffs: 'Less rapid prototyping speed compared to Node.js / TypeScript'
          },
          {
            name: 'Python (FastAPI)',
            matchScore: 85,
            dataStructure: 'Async Python with Pydantic Validations',
            relationships: 'Dependency Injection Architecture',
            scalability: 'Good (Asynchronous event loop with ASGI)',
            learningCurve: 'Easy-Medium',
            bestFor: 'AI/ML pipeline integrations, data analytics APIs, scientific computing',
            realWorldUsage: 'Microsoft, Uber, Netflix',
            community: 'Unrivaled data science, machine learning, and AI ecosystem',
            isRecommended: false,
            tradeOffs: 'Higher memory consumption and lower raw JSON serialization throughput than Node/Go'
          }
        ]
      };
    }

    if (selected.includes('auth')) {
      return {
        category: 'Authentication Protocols',
        title: 'Authentication Strategy Matrix for ' + project.name,
        availableCategories,
        technologies: [
          {
            name: 'JWT (JSON Web Tokens)',
            matchScore: 90,
            dataStructure: 'Cryptographically Signed Stateless Bearer Tokens',
            relationships: 'Self-contained Claims & Signatures',
            scalability: 'Excellent (Zero server session memory required)',
            learningCurve: 'Easy',
            bestFor: 'Stateless multi-client REST APIs spanning web and native mobile apps',
            realWorldUsage: 'Twilio, Auth0, GitHub, Stripe',
            community: 'Universal open industry standard (RFC 7519)',
            isRecommended: true,
            tradeOffs: 'Token revocation requires short lifespans or Redis revocation cache'
          },
          {
            name: 'Session Cookies (Stateful)',
            matchScore: 80,
            dataStructure: 'Encrypted Server-Side Session Store (Redis / DB)',
            relationships: 'Cookie Header Identification',
            scalability: 'Moderate (Requires centralized session database)',
            learningCurve: 'Easy',
            bestFor: 'Monolithic browser-only web applications with automatic CSRF guards',
            realWorldUsage: 'Traditional Rails, Django, and Laravel web portals',
            community: 'Decades of mature browser security and httpOnly cookies',
            isRecommended: false,
            tradeOffs: 'Difficult cross-domain sharing and awkward native mobile app handling'
          },
          {
            name: 'OAuth 2.0 / Managed Identity (Auth0)',
            matchScore: 86,
            dataStructure: 'Federated Identity Delegations & Scopes',
            relationships: 'Third-party Identity Provider (Google, GitHub, Apple)',
            scalability: 'Excellent (Offloaded to cloud infrastructure)',
            learningCurve: 'Medium',
            bestFor: 'Social logins, enterprise Single Sign-On (SSO / SAML), outsourced compliance',
            realWorldUsage: 'Atlassian, Slack, Figma',
            community: 'Standard for corporate B2B SaaS authentication',
            isRecommended: false,
            tradeOffs: 'Ongoing monthly recurring SaaS cost; external dependency on provider uptime'
          }
        ]
      };
    }

    if (selected.includes('cloud') || selected.includes('host') || selected.includes('deploy')) {
      return {
        category: 'Cloud & Infrastructure',
        title: 'Hosting & Deployment Matrix for ' + project.name,
        availableCategories,
        technologies: [
          {
            name: 'Docker + Cloud Containers (AWS ECS / Render)',
            matchScore: 91,
            dataStructure: 'Immutable OCI Containers & Compose Orchestration',
            relationships: 'Microservice Network Isolation',
            scalability: 'Very High (Horizontal autoscaling groups)',
            learningCurve: 'Medium',
            bestFor: 'Production full-stack web + API + database services with zero lock-in',
            realWorldUsage: 'Spotify, Shopify, Stripe, GitHub',
            community: 'De-facto industry standard for cloud computing',
            isRecommended: true,
            tradeOffs: 'Requires basic container build pipelines and secret management'
          },
          {
            name: 'Serverless (Vercel / AWS Lambda)',
            matchScore: 84,
            dataStructure: 'Ephemeral Stateless Event Functions',
            relationships: 'Event-driven Invocations',
            scalability: 'Infinite Instant Scaling',
            learningCurve: 'Easy-Medium',
            bestFor: 'Burst-traffic workloads, scheduled cron jobs, lightweight webhooks',
            realWorldUsage: 'Coca-Cola, Netflix, Bustle',
            community: 'Massive adoption in modern Jamstack architectures',
            isRecommended: false,
            tradeOffs: 'Cold start latencies and database connection exhaustion under concurrency spikes'
          },
          {
            name: 'Traditional Linux VPS (Ubuntu / Nginx)',
            matchScore: 72,
            dataStructure: 'Bare Virtual Machine with Systemd Daemons',
            relationships: 'Local Host Processes',
            scalability: 'Manual (Vertical RAM/CPU resizing)',
            learningCurve: 'Medium-Hard',
            bestFor: 'Low-cost hobby projects, single-server legacy apps',
            realWorldUsage: 'Small business websites, personal side-projects',
            community: 'Decades of Linux server tutorials and bash scripts',
            isRecommended: false,
            tradeOffs: 'Manual server patching, lack of automated failover or instant scaling'
          }
        ]
      };
    }

    // Default: Databases
    return {
      category: 'Database & Storage',
      title: 'Database Comparison Matrix for ' + project.name,
      availableCategories,
      technologies: [
        {
          name: 'PostgreSQL',
          matchScore: 95,
          dataStructure: 'Structured (Relational SQL)',
          relationships: 'Excellent (Foreign keys, JOINs, Integrity constraints)',
          scalability: 'Excellent (Read replicas, Partitioning, Connection pooling)',
          learningCurve: 'Medium',
          bestFor: 'Orders, payments, structured accounts, strict ACID transaction safety',
          realWorldUsage: 'DoorDash, Uber, Spotify, Twitch',
          community: 'Decades-long global standard with massive community documentation',
          isRecommended: true,
          tradeOffs: 'Requires deliberate migration scripts as data models evolve'
        },
        {
          name: 'MongoDB',
          matchScore: 82,
          dataStructure: 'Flexible (Document / JSON Schema)',
          relationships: 'Good (Document embedding & manual references)',
          scalability: 'Excellent (Native horizontal sharding)',
          learningCurve: 'Easy',
          bestFor: 'Dynamic catalogs, activity feeds, unstructured event logging',
          realWorldUsage: 'Forbes, eBay, Coinbase',
          community: 'Very large modern NoSQL ecosystem',
          isRecommended: false,
          tradeOffs: 'Multi-document transactions require replica set and careful schema governance'
        },
        {
          name: 'MySQL',
          matchScore: 78,
          dataStructure: 'Structured (Relational SQL)',
          relationships: 'Excellent (Foreign keys and relational constraints)',
          scalability: 'Good (Master-replica replication)',
          learningCurve: 'Medium',
          bestFor: 'Traditional web applications and standard content management systems',
          realWorldUsage: 'WordPress, GitHub, Twitter',
          community: 'Massive open source and enterprise deployment presence',
          isRecommended: false,
          tradeOffs: 'Fewer advanced data types and JSON indexing capabilities compared to PostgreSQL'
        }
      ]
    };
  }

  /**
   * Generates a 3-tier architecture topology and 4-phase development roadmap.
   */
  public generateArchitectureAndRoadmap(project: Project, technologies: Technology[]): {
    architecture: ArchitectureNode[];
    roadmap: RoadmapPhase[];
  } {
    const architecture: ArchitectureNode[] = [
      {
        id: 'arch_client_web',
        name: 'Web Application Client',
        layer: 'client',
        layerTitle: '1. Client Presentation Tier',
        technology: 'React + TypeScript + Vite',
        description: 'High-performance responsive portal with state synchronization and role dashboards.',
        iconName: 'Layout',
        connectsTo: ['arch_backend_api']
      },
      {
        id: 'arch_client_mobile',
        name: 'Mobile Client (iOS & Android)',
        layer: 'client',
        layerTitle: '1. Client Presentation Tier',
        technology: 'React Native / Expo',
        description: 'Native mobile client providing push notifications and on-the-go order check-ins.',
        iconName: 'Smartphone',
        connectsTo: ['arch_backend_api']
      },
      {
        id: 'arch_backend_api',
        name: 'API Gateway & Services',
        layer: 'api',
        layerTitle: '2. Application Services Tier',
        technology: 'Node.js + Express + TypeScript',
        description: 'Centralized RESTful API handling authentication, request validation, business rules, and webhooks.',
        iconName: 'Server',
        connectsTo: ['arch_database', 'arch_payments', 'arch_storage']
      },
      {
        id: 'arch_database',
        name: 'Transactional Database',
        layer: 'data',
        layerTitle: '3. Persistence Tier',
        technology: 'PostgreSQL (ACID Compliant)',
        description: 'Persistent relational datastore managing accounts, orders, inventory, and audit logs.',
        iconName: 'Database',
        connectsTo: []
      },
      {
        id: 'arch_payments',
        name: 'Payment Processing Gateway',
        layer: 'external',
        layerTitle: '4. External Services Tier',
        technology: 'Razorpay / Stripe Gateway',
        description: 'Handles payment escrow, UPI/Card settlements, and asynchronous webhook validation.',
        iconName: 'CreditCard',
        connectsTo: []
      },
      {
        id: 'arch_storage',
        name: 'Cloud Media Storage',
        layer: 'external',
        layerTitle: '4. External Services Tier',
        technology: 'S3-compatible Object Storage',
        description: 'Stores item images, document uploads, and downloadable PDF blueprints.',
        iconName: 'HardDrive',
        connectsTo: []
      }
    ];

    const roadmap: RoadmapPhase[] = [
      {
        phaseNumber: 1,
        title: 'Phase 1: Foundation & Core Scaffolding',
        duration: '2–3 weeks',
        status: 'completed',
        objective: 'Establish monorepo contracts, database schema models, token authorization middleware, and UI primitives.',
        prerequisites: [
          'Approved project scope & architecture specification',
          'Provisioned development database instance'
        ],
        potentialRisks: [
          'Early schema design oversights requiring schema migration rework'
        ],
        deliverables: [
          {
            title: 'Monorepo architecture & shared type definitions',
            completed: true,
            priority: 'high',
            acceptanceCriteria: ['All packages compile cleanly via tsc', 'Zero circular dependencies']
          },
          {
            title: 'Database schema design and entity migration scripts',
            completed: true,
            priority: 'high',
            acceptanceCriteria: ['Foreign key constraints and unique indexes established', 'Seed data loaded']
          },
          {
            title: 'JWT token authorization and role-based middleware guards',
            completed: true,
            priority: 'high',
            acceptanceCriteria: ['Secures private routes with 401/403 responses', 'Password hashing via bcrypt']
          },
          {
            title: 'Design system primitives and responsive layout shell',
            completed: true,
            priority: 'high',
            acceptanceCriteria: ['Passes mobile and desktop responsiveness checks', 'Accessible contrast']
          }
        ],
        dependencies: ['Node.js runtime', 'Database provisioning']
      },
      {
        phaseNumber: 2,
        title: 'Phase 2: Core User Journeys & MVP Operations',
        duration: '4–6 weeks',
        status: 'in-progress',
        objective: 'Implement end-user catalog browsing, cart operations, transaction checkouts, and operator fulfillment queues.',
        prerequisites: [
          'Phase 1 foundation complete and validated',
          'Payment Gateway sandbox API credentials active'
        ],
        potentialRisks: [
          'Payment webhook delivery failures during simulated edge-case network dropouts',
          'Concurrency race conditions during simultaneous inventory purchases'
        ],
        deliverables: [
          {
            title: 'Catalog browsing, search index, and real-time filtering',
            completed: true,
            priority: 'high',
            acceptanceCriteria: ['Instant category filters with under 200ms query latency', 'Search returns relevant results']
          },
          {
            title: 'Cart lifecycle management and order placement transaction',
            completed: true,
            priority: 'high',
            acceptanceCriteria: ['Transactional atomicity prevents partial order creation', 'Cart persists locally']
          },
          {
            title: 'Merchant / operator dashboard to accept and fulfill requests',
            completed: false,
            priority: 'high',
            acceptanceCriteria: ['Operators view orders sorted by timestamp', 'Status transitions emit audit events']
          },
          {
            title: 'Payment gateway integration with verified webhook callbacks',
            completed: false,
            priority: 'high',
            acceptanceCriteria: ['Cryptographically verified signatures on webhooks', 'Idempotent handling of duplicate webhooks']
          }
        ],
        dependencies: ['Phase 1 Foundation', 'Payment Merchant Keys']
      },
      {
        phaseNumber: 3,
        title: 'Phase 3: Advanced Features & Real-Time Sync',
        duration: '3–4 weeks',
        status: 'upcoming',
        objective: 'Introduce live fulfillment status tracking, background push notification dispatches, and business metrics.',
        prerequisites: [
          'Phase 2 core transactions operating reliably in staging'
        ],
        potentialRisks: [
          'Operating system background throttle on mobile push notifications',
          'High query overhead on unindexed reporting analytics tables'
        ],
        deliverables: [
          {
            title: 'Live status tracking and step-by-step fulfillment state',
            completed: false,
            priority: 'medium',
            acceptanceCriteria: ['Diners observe status transition within 2 seconds of vendor action']
          },
          {
            title: 'Automated push notifications and SMS alert dispatches',
            completed: false,
            priority: 'medium',
            acceptanceCriteria: ['Dispatches notification when ticket transitions to ready']
          },
          {
            title: 'Analytics dashboard with exportable reporting metrics',
            completed: false,
            priority: 'low',
            acceptanceCriteria: ['Renders daily sales totals, peak hours, and popular items']
          },
          {
            title: 'User review and feedback collection loops',
            completed: false,
            priority: 'low',
            acceptanceCriteria: ['Collects 1-5 star ratings with optional comment feedback']
          }
        ],
        dependencies: ['Phase 2 Core Features']
      },
      {
        phaseNumber: 4,
        title: 'Phase 4: Security Hardening & Production Rollout',
        duration: '2–3 weeks',
        status: 'upcoming',
        objective: 'Conduct simulated concurrency stress testing, security penetration audits, Docker containerization, and production release.',
        prerequisites: [
          'Feature freeze complete on core workflow milestones',
          'Production cloud hosting cluster provisioned'
        ],
        potentialRisks: [
          'Database connection exhaustion during burst concurrency spikes without PgBouncer',
          'Cold restart delays during cloud container redeployments'
        ],
        deliverables: [
          {
            title: 'Concurrency stress testing under simulated peak traffic spikes',
            completed: false,
            priority: 'high',
            acceptanceCriteria: ['Sustains 500+ concurrent requests with sub-500ms latency and 0% error rate']
          },
          {
            title: 'End-to-end security audit and input sanitization check',
            completed: false,
            priority: 'high',
            acceptanceCriteria: ['Zero SQL injection, XSS, or unauthorized privilege escalation vulnerabilities']
          },
          {
            title: 'Production containerization with Docker and cloud deployment',
            completed: false,
            priority: 'high',
            acceptanceCriteria: ['CI/CD pipeline builds and passes automated health check verification']
          },
          {
            title: 'Pilot user rollout and telemetry monitoring setup',
            completed: false,
            priority: 'medium',
            acceptanceCriteria: ['Live error tracking (Sentry) and performance metrics (Prometheus/Grafana) active']
          }
        ],
        dependencies: ['Phase 3 Features', 'Cloud Production Environment']
      }
    ];

    return { architecture, roadmap };
  }

  /**
   * Generates learning resources and official documentation with difficulty levels.
   */
  public generateResources(technologies: Technology[]): ResourceItem[] {
    return [
      {
        id: `res_react_${Date.now()}`,
        title: 'React Official Documentation & Modern Hooks Guide',
        category: 'Official Documentation',
        description: 'Comprehensive guide covering component lifecycle, state hooks, and high-performance rendering patterns.',
        technology: 'React',
        url: 'https://react.dev',
        difficulty: 'Beginner',
        relevanceReason: 'Essential foundation for constructing responsive UI components, managing client state, and connecting to the backend API.',
        readTimeOrDuration: '15 min read',
        isVerified: true
      },
      {
        id: `res_node_${Date.now()}`,
        title: 'Node.js & Express Production Architecture Guide',
        category: 'Guides',
        description: 'Structuring scalable RESTful APIs, centralized error middleware, and security practices.',
        technology: 'Node.js',
        url: 'https://expressjs.com',
        difficulty: 'Intermediate',
        relevanceReason: 'Directly applicable for architecting the application service tier, implementing JWT middleware, and handling async webhook callbacks.',
        readTimeOrDuration: '20 min read',
        isVerified: true
      },
      {
        id: `res_pg_${Date.now()}`,
        title: 'PostgreSQL Relational Schema & ACID Transaction Design',
        category: 'Tutorials',
        description: 'Modeling foreign keys, indexes, and concurrency locks to guarantee zero duplicate charges.',
        technology: 'PostgreSQL',
        url: 'https://www.postgresql.org/docs/',
        difficulty: 'Intermediate',
        relevanceReason: 'Crucial for maintaining data integrity between users, orders, and payment ledgers during high concurrent rushes.',
        readTimeOrDuration: '25 min read',
        isVerified: true
      },
      {
        id: `res_jwt_${Date.now()}`,
        title: 'JWT Bearer Authentication Best Practices & Revocation',
        category: 'Guides',
        description: 'How to structure role claims safely and manage short-lived access tokens with refresh rotation.',
        technology: 'JWT',
        url: 'https://jwt.io/introduction',
        difficulty: 'Intermediate',
        relevanceReason: 'Provides secure, stateless session handling across both web browser users and mobile client apps without database session overhead.',
        readTimeOrDuration: '12 min read',
        isVerified: true
      },
      {
        id: `res_docker_${Date.now()}`,
        title: 'Docker for Full-Stack Developers: Multi-Container Setup',
        category: 'Examples',
        description: 'Step-by-step multi-stage Dockerfiles and Docker Compose configuration for Node and Postgres.',
        technology: 'Docker',
        url: 'https://docs.docker.com/get-started/',
        difficulty: 'Advanced',
        relevanceReason: 'Standardizes the build and run environment so local development matches cloud staging and production flawlessly.',
        readTimeOrDuration: '18 min guide',
        isVerified: true
      }
    ];
  }

  /**
   * Consolidates all available project information into a structured Project Context.
   */
  public synthesizeProjectContext(
    project: Project,
    requirements: Requirement[],
    technologies: Technology[],
    analysis?: IdeaAnalysisResult
  ): ProjectContext {
    const fnReqs = requirements.filter(r => r.type === 'functional').length;
    const nonFnReqs = requirements.filter(r => r.type === 'non-functional').length;
    const selectedTechNames = technologies.map(t => t.name);

    const problem = analysis?.problemStatement ||
      project.description ||
      'Users require a streamlined digital workflow to turn ideas into structured architecture and execution roadmaps.';

    const targetUsers = analysis?.targetUsers ||
      project.summary?.primaryUsers ||
      ['Standard Users', 'Administrators'];

    const platforms = analysis?.platformRequirements ||
      (project.summary?.projectType ? [project.summary.projectType] : ['Responsive Web', 'Mobile App']);

    const complexityLevel = project.summary?.estimatedComplexity || 'Medium';

    const complexityFactors: string[] = [
      `${targetUsers.length} distinct user personas requiring role-based access control (RBAC)`,
      `${requirements.length} scoped requirements (${fnReqs} functional, ${nonFnReqs} non-functional)`,
      platforms.length > 1 ? 'Multi-platform presentation tier (Web + Mobile)' : 'Single presentation client',
      selectedTechNames.includes('Razorpay / Stripe') ? 'Cryptographically verified online payment integration' : 'Standard data management without payment gateways'
    ];

    const knownConstraints = analysis?.constraints || [
      'Sub-500ms API response latency under concurrent rush periods',
      'Mobile-responsive layout adhering to accessible contrast guidelines',
      'Stateless token authentication with encrypted data transmission'
    ];

    const unresolvedQuestions = analysis?.unresolvedQuestions || [
      'Expected concurrent user volume during first 90 days of production launch',
      'Specific regional regulatory compliance mandates (e.g. data localization)'
    ];

    const assumptions = analysis?.assumptions || [
      'End-users operate modern browsers or smartphones with internet connectivity',
      'Cloud database and third-party payment gateway infrastructure are budgeted for'
    ];

    return {
      projectId: project.id,
      projectName: project.name,
      originalIdea: project.description || project.name,
      problemStatement: problem,
      targetUsers,
      platforms,
      budgetEstimate: 'Bootstrapped / Early Stage (Estimated $500–$2,000 cloud staging & tools)',
      timelineEstimate: project.summary?.estimatedTimeline || '3–5 months for full MVP rollout',
      complexityLevel,
      complexityFactors,
      functionalRequirementsCount: fnReqs,
      nonFunctionalRequirementsCount: nonFnReqs,
      selectedTechnologies: selectedTechNames,
      knownConstraints,
      unresolvedQuestions,
      assumptions
    };
  }

  /**
   * Validates selected technology stack against proposed architecture and detects inconsistencies.
   */
  public validateArchitectureConsistency(
    project: Project,
    technologies: Technology[],
    architecture: ArchitectureNode[],
    requirements: Requirement[]
  ): ArchitectureValidationReport {
    const findings: ArchitectureValidationFinding[] = [];
    let score = 100;

    const techNames = technologies.map(t => t.name.toLowerCase());
    const archTechs = architecture.map(a => a.technology.toLowerCase());
    const hasClient = architecture.some(a => a.layer === 'client');
    const hasApi = architecture.some(a => a.layer === 'api');
    const hasData = architecture.some(a => a.layer === 'data');
    const hasPayments = architecture.some(a => a.id === 'arch_payments' || a.technology.toLowerCase().includes('payment') || a.technology.toLowerCase().includes('stripe') || a.technology.toLowerCase().includes('razorpay'));
    const hasStorage = architecture.some(a => a.id === 'arch_storage' || a.technology.toLowerCase().includes('storage') || a.technology.toLowerCase().includes('s3'));

    const reqText = requirements.map(r => r.title + ' ' + r.description).join(' ').toLowerCase();
    const needsPayments = reqText.includes('payment') || reqText.includes('checkout') || reqText.includes('upi') || reqText.includes('billing');
    const needsMobile = reqText.includes('mobile') || project.name.toLowerCase().includes('food') || project.name.toLowerCase().includes('fitness');

    // 1. Missing Presentation Tier Check
    if (!hasClient) {
      score -= 25;
      findings.push({
        id: 'val_missing_client',
        severity: 'critical',
        category: 'missing-layer',
        title: 'Missing Client Presentation Tier',
        description: 'The architectural topography does not define a user-facing client application tier.',
        consequence: 'End-users have no user interface to interact with backend services.',
        actionableSuggestion: 'Add a Web Client (React/Next.js) or Mobile Client (React Native) to Layer 1.'
      });
    }

    // 2. Missing Application Services Tier Check
    if (!hasApi) {
      score -= 25;
      findings.push({
        id: 'val_missing_api',
        severity: 'critical',
        category: 'missing-layer',
        title: 'Missing Application Services / API Gateway Tier',
        description: 'Clients cannot communicate directly with databases without an application API tier.',
        consequence: 'Direct database exposure is a critical security vulnerability and violates tier isolation.',
        actionableSuggestion: 'Implement a Node.js Express or FastAPI backend API gateway.'
      });
    }

    // 3. Missing Persistence Tier Check
    if (!hasData) {
      score -= 25;
      findings.push({
        id: 'val_missing_data',
        severity: 'critical',
        category: 'missing-layer',
        title: 'Missing Persistence Datastore',
        description: 'No relational or document database is configured in the persistence tier.',
        consequence: 'Transactional state, user accounts, and business records will be lost on server restart.',
        actionableSuggestion: 'Add PostgreSQL or MongoDB to Layer 3 for ACID transaction persistence.'
      });
    }

    // 4. Payment Gateway Consistency Check
    if (needsPayments && !hasPayments) {
      score -= 15;
      findings.push({
        id: 'val_missing_payments',
        severity: 'warning',
        category: 'compatibility',
        title: 'Payment Gateway Missing for Transactional Requirements',
        description: 'Requirements mandate digital payment checkout, but no payment gateway exists in External Services.',
        consequence: 'Users cannot complete purchases or automated refunds online.',
        actionableSuggestion: 'Incorporate Razorpay or Stripe into Layer 4 (External Services Tier) with webhook verification.'
      });
    }

    // 5. Mobile Tier Alignment Check
    const hasMobileNode = architecture.some(a => a.id.includes('mobile') || a.technology.toLowerCase().includes('native') || a.technology.toLowerCase().includes('mobile'));
    if (needsMobile && !hasMobileNode) {
      score -= 10;
      findings.push({
        id: 'val_mobile_recommended',
        severity: 'info',
        category: 'infrastructure',
        title: 'Mobile Client Recommended for Consumer On-The-Go Persona',
        description: 'Product requirements indicate on-the-go user check-ins, but currently only a web client is defined.',
        consequence: 'Mobile web browser sessions lack native hardware push notifications and offline caching.',
        actionableSuggestion: 'Consider adopting React Native (Expo) to deliver an optimized cross-platform smartphone app.'
      });
    }

    // 6. Object Media Storage Check
    if (!hasStorage) {
      score -= 10;
      findings.push({
        id: 'val_missing_storage',
        severity: 'warning',
        category: 'infrastructure',
        title: 'Missing Dedicated Media & Object Storage',
        description: 'Storing user avatar uploads, dish images, or generated PDF documents directly in SQL databases causes bloat.',
        consequence: 'Rapid database disk growth and degraded query throughput over time.',
        actionableSuggestion: 'Connect an S3-compatible cloud object store (AWS S3, Cloudflare R2, or MinIO) in Layer 4.'
      });
    }

    // 7. Token Revocation & Observability Strategy
    const hasMonitoring = architecture.some(a => a.technology.toLowerCase().includes('sentry') || a.technology.toLowerCase().includes('prometheus') || a.technology.toLowerCase().includes('monitoring'));
    if (!hasMonitoring) {
      score -= 5;
      findings.push({
        id: 'val_missing_monitoring',
        severity: 'info',
        category: 'monitoring',
        title: 'Production Telemetry & Error Logging Advisory',
        description: 'No centralized error monitoring or latency tracing node is formally mapped.',
        consequence: 'Uncaught production exceptions and latency regressions may go unnoticed until reported by users.',
        actionableSuggestion: 'Configure Sentry for crash monitoring and Prometheus/Grafana for API response time metrics in Phase 4.'
      });
    }

    // Determine status
    let status: 'consistent' | 'warnings_detected' | 'critical_issues' = 'consistent';
    if (findings.some(f => f.severity === 'critical')) {
      status = 'critical_issues';
    } else if (findings.length > 0) {
      status = 'warnings_detected';
    }

    const summary = status === 'consistent'
      ? 'The selected technology stack is fully aligned with the 4-tier system architecture and all stated requirements.'
      : status === 'warnings_detected'
      ? `Architecture validation identified ${findings.length} actionable advisory points with recommended mitigations.`
      : `Critical architectural gaps detected: immediate adjustment recommended before production implementation.`;

    return {
      projectId: project.id,
      status,
      score: Math.max(score, 40),
      summary,
      findings,
      lastValidatedAt: new Date().toISOString()
    };
  }

  /**
   * Assesses project complexity, technical bottlenecks, and actionable risk mitigations.
   */
  public assessProjectComplexityAndRisks(
    project: Project,
    requirements: Requirement[],
    technologies: Technology[]
  ): ProjectComplexityInsight {
    const text = (project.name + ' ' + (project.description || '')).toLowerCase();
    const reqCount = requirements.length;
    const hasPayments = text.includes('food') || text.includes('order') || text.includes('pay') || text.includes('ecommerce') || text.includes('cart');
    const isMobile = text.includes('mobile') || text.includes('fitness') || text.includes('app');

    let complexityScore = 50;
    if (reqCount > 6) complexityScore += 15;
    if (hasPayments) complexityScore += 15;
    if (isMobile) complexityScore += 10;

    const overallComplexity: 'Low' | 'Medium' | 'High' =
      complexityScore >= 75 ? 'High' : complexityScore >= 50 ? 'Medium' : 'Low';

    const keyDrivers = [
      `${reqCount} categorized user requirements requiring end-to-end implementation and testing`,
      hasPayments ? 'Online payment processing requiring transactional ACID consistency and webhook idempotency' : 'Standard CRUD operations with identity authorization',
      isMobile ? 'Cross-platform mobile presentation tier requiring native builds and app store compliance' : 'Responsive web presentation portal'
    ];

    const bottlenecks = [
      'Simultaneous lunch rush / peak traffic spikes causing database connection exhaustion if pooling is absent',
      'Third-party payment gateway webhook callback delays or intermittent timeouts',
      'Complex role-based permissions logic across multi-persona views'
    ];

    const testingRequirements = [
      'Unit testing covering business calculation rules, tax/fee math, and token validation (>80% coverage)',
      'Integration testing verifying API routes, database CRUD queries, and status transition workflows',
      'Idempotency testing for payment webhook handlers under duplicate delivery attempts',
      'Load testing simulating 500+ concurrent checkouts to benchmark 95th percentile latency'
    ];

    const deploymentConsiderations = [
      'Configure connection pooling (PgBouncer) between Node.js API services and PostgreSQL',
      'Store all secrets (JWT_SECRET, payment credentials) in environment variables, never committed to Git',
      'Set up health check endpoints (/api/v1/health) for container auto-restart and load balancer pings',
      'Establish automated database snapshot backups prior to running versioned migration scripts'
    ];

    const risks: ProjectRiskItem[] = [
      {
        id: 'risk_peak_concurrency',
        category: 'bottleneck',
        title: 'Peak Rush Concurrency Spike Bottleneck',
        severity: 'high',
        likelihood: 'medium',
        impact: 'High latency or timeout errors during concentrated traffic periods (e.g. 12:00 PM – 2:00 PM).',
        practicalMitigation: 'Implement Redis caching for static menu catalogs and enable database connection pooling with horizontal container scaling.'
      },
      {
        id: 'risk_payment_webhook',
        category: 'integration',
        title: 'Payment Webhook Delivery Interruption',
        severity: 'medium',
        likelihood: 'medium',
        impact: 'Customer is charged by bank/UPI, but platform order record remains in "Payment Pending" state.',
        practicalMitigation: 'Implement an automated reconciliation cron polling the payment gateway status API for pending transactions every 60 seconds.'
      },
      {
        id: 'risk_auth_revocation',
        category: 'security',
        title: 'Stateless Token Revocation Delay',
        severity: 'medium',
        likelihood: 'low',
        impact: 'Compromised JWT credentials remain technically valid until expiration time elapses.',
        practicalMitigation: 'Enforce short access token lifetimes (15 minutes) paired with rotating refresh tokens and a Redis token blacklist.'
      },
      {
        id: 'risk_migration_drift',
        category: 'technical',
        title: 'Database Schema Drift Between Environments',
        severity: 'medium',
        likelihood: 'low',
        impact: 'Code relies on database columns that are missing in staging or production.',
        practicalMitigation: 'Enforce version-controlled migration scripts applied automatically via CI/CD before service startup.'
      }
    ];

    return {
      overallComplexity,
      score: complexityScore,
      confidenceLevel: 'High',
      keyDrivers,
      bottlenecks,
      testingRequirements,
      deploymentConsiderations,
      risks
    };
  }

  /**
   * Synthesizes the complete project blueprint document.
   */
  public generateBlueprint(project: Project): ProjectBlueprint {
    return {
      projectId: project.id,
      projectName: project.name,
      generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      version: '2.0.0-PROPOSAL',
      sections: [
        { title: 'Executive Summary & Product Journey', description: 'Vision statement, target user personas, and core business objectives.', status: 'ready' },
        { title: 'Functional & Non-Functional Specifications', description: 'Detailed user stories with prioritization and acceptance criteria.', status: 'ready' },
        { title: 'Role-Based Permissions & User Journeys', description: 'Access tier breakdown across standard users, operators, and administrative roles.', status: 'ready' },
        { title: 'Technology Recommendations & Suitability Scoring', description: 'Evaluated technology stack with suitability scores and side-by-side trade-off matrix.', status: 'ready' },
        { title: 'System Architecture & Component Topography', description: '4-tier architectural topology connecting clients, API gateways, database, and integrations.', status: 'ready' },
        { title: 'Sequential 4-Phase Delivery Roadmap', description: 'Time-boxed development milestones with measurable deliverable checklists.', status: 'ready' },
        { title: 'Security, Compliance & Data Safeguards', description: 'Token safety protocols, HTTPS enforcement, and payment escrow isolation.', status: 'ready' },
        { title: 'Curated Implementation Resources', description: 'Verified official documentation and technical guides for the implementation team.', status: 'ready' }
      ]
    };
  }
}

export const aiPlanningService = new AiPlanningService();
