import {
  Project,
  Requirement,
  Technology,
  TechComparisonGroup,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
  Message
} from '../types';

export const fallbackProject: Project = {
  id: 'proj_college_food_01',
  userId: 'usr_demo_01',
  name: 'College Food Ordering Platform',
  description: 'A seamless web and mobile food ordering system connecting college students with campus cafeterias and nearby partnered restaurants.',
  status: 'in-progress',
  currentStage: 'planning',
  summary: {
    projectType: 'Web + Mobile Application',
    primaryUsers: ['Students', 'Restaurants', 'Admin'],
    industry: 'Food & Beverage / Education',
    keyFeatures: [
      'Food ordering',
      'Secure payment processing',
      'Real-time order tracking',
      'Restaurant menu & order management',
      'Campus delivery hub coordination'
    ],
    estimatedComplexity: 'Medium',
    estimatedTimeline: '3–6 months',
    goals: [
      'Make food ordering easier and faster for students during class intervals',
      'Help campus restaurants manage high volume orders without queues',
      'Provide a smooth, responsive ordering and checkout experience',
      'Support secure online payments & student meal wallet integration',
      'Support future growth and multi-campus scaling'
    ],
    targetAudience: ['Students', 'Restaurants', 'College Admins']
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const fallbackRequirements: Requirement[] = [
  {
    id: 'req_01',
    projectId: 'proj_college_food_01',
    title: 'User Management',
    description: 'Students, restaurants and admins should be able to register, login, reset passwords, and manage their profiles with role-based permissions.',
    type: 'functional',
    priority: 'high',
    category: 'Authentication & Profile'
  },
  {
    id: 'req_02',
    projectId: 'proj_college_food_01',
    title: 'Food Ordering',
    description: 'Students can browse menus by cafeteria/restaurant, customize options, add items to cart, and place orders smoothly.',
    type: 'functional',
    priority: 'high',
    category: 'Core Commerce'
  },
  {
    id: 'req_03',
    projectId: 'proj_college_food_01',
    title: 'Restaurant Management',
    description: 'Restaurants can manage menu items, pricing, availability toggles, opening hours, and view incoming live orders.',
    type: 'functional',
    priority: 'high',
    category: 'Merchant Operations'
  },
  {
    id: 'req_04',
    projectId: 'proj_college_food_01',
    title: 'Order Management & Status',
    description: 'Track order status in real time through clear states: Placed, Preparing, Ready for Pickup, and Completed.',
    type: 'functional',
    priority: 'high',
    category: 'Fulfillment'
  },
  {
    id: 'req_05',
    projectId: 'proj_college_food_01',
    title: 'Payment Integration',
    description: 'Support secure online payments (UPI, credit/debit cards, campus meal pass) with automatic receipt generation.',
    type: 'functional',
    priority: 'high',
    category: 'Billing'
  },
  {
    id: 'req_06',
    projectId: 'proj_college_food_01',
    title: 'Notifications',
    description: 'Send instant order status updates and estimated pickup time alerts via push notifications and SMS.',
    type: 'functional',
    priority: 'medium',
    category: 'Engagement'
  },
  {
    id: 'req_07',
    projectId: 'proj_college_food_01',
    title: 'High Availability During Lunch Rush',
    description: 'System must sustain 500+ concurrent orders during 12:00 PM – 2:00 PM peak periods with sub-500ms latency.',
    type: 'non-functional',
    priority: 'high',
    category: 'Performance'
  },
  {
    id: 'req_08',
    projectId: 'proj_college_food_01',
    title: 'Data Privacy & Payment Security',
    description: 'PCI-DSS compliance via payment tokenization and encrypted student authentication tokens.',
    type: 'non-functional',
    priority: 'high',
    category: 'Security'
  }
];

export const fallbackTechnologies: Technology[] = [
  {
    id: 'tech_react',
    name: 'React',
    category: 'Frontend',
    tagline: 'Modern UI library for interactive web interfaces',
    description: 'Declarative component-based library ensuring lightning-fast updates and cross-platform component reuse.',
    matchScore: 94,
    isRecommended: true,
    keyInfo: {
      category: 'Frontend Library',
      type: 'Single Page Application / Framework',
      license: 'MIT (Open Source)',
      learningCurve: 'Medium',
      scalability: 'Excellent',
      ecosystem: 'Very High'
    },
    metrics: {
      popularity: 95,
      easeOfLearning: 75,
      scalability: 96,
      ecosystem: 98
    },
    whyRecommended: [
      'Huge ecosystem with robust UI kits and battle-tested food ordering templates',
      'Shared logic and component models with React Native for the mobile app',
      'Excellent performance with virtual DOM and state management libraries'
    ],
    benefits: [
      'Reusable component structure simplifies complex menu & cart interactions',
      'Seamless hydration and rich client-side responsiveness',
      'Massive community support and abundant hiring availability'
    ],
    tradeOffs: [
      'Requires choosing complementary routing and state libraries (Vite, React Router, Zustand/Context)',
      'Fast-paced ecosystem can require careful dependency management'
    ],
    alternatives: ['Vue.js', 'Next.js', 'Svelte'],
    realWorldUsage: 'Used by DoorDash, Uber Eats, and Airbnb for responsive web ordering interfaces.',
    learningResourcesCount: 4
  },
  {
    id: 'tech_nodejs',
    name: 'Node.js',
    category: 'Backend',
    tagline: 'Scalable server-side JavaScript/TypeScript runtime environment',
    description: 'Asynchronous event-driven runtime ideal for high-concurrency order handling and low-latency API responses.',
    matchScore: 92,
    isRecommended: true,
    keyInfo: {
      category: 'Backend Runtime',
      type: 'Event-driven Asynchronous I/O',
      license: 'OpenJS Foundation',
      learningCurve: 'Medium',
      scalability: 'Very High',
      ecosystem: 'Very High'
    },
    metrics: {
      popularity: 92,
      easeOfLearning: 80,
      scalability: 90,
      ecosystem: 95
    },
    whyRecommended: [
      'Single language (TypeScript/JavaScript) across frontend, mobile, and backend reduces context switching',
      'Non-blocking I/O handles hundreds of simultaneous cafeteria ordering sockets effortlessly',
      'Fast iteration cycles with Express and NPM package ecosystem'
    ],
    benefits: [
      'Exceptional I/O throughput for real-time status updates',
      'Huge npm repository of tested packages for payments, auth, and webhooks',
      'Easy containerization with Docker'
    ],
    tradeOffs: [
      'Single-threaded event loop means CPU-heavy tasks must be offloaded to worker threads or microservices',
      'Requires strict TypeScript typing to avoid runtime bugs'
    ],
    alternatives: ['Go (Golang)', 'Python (FastAPI)', 'Java (Spring Boot)'],
    realWorldUsage: 'Powers high-traffic checkout flows at PayPal, Netflix, and LinkedIn.',
    learningResourcesCount: 5
  },
  {
    id: 'tech_postgres',
    name: 'PostgreSQL',
    category: 'Database',
    tagline: 'Reliable relational database management system',
    description: 'PostgreSQL is an open-source relational database designed for applications that need reliable structured data, strong relationships and powerful querying.',
    matchScore: 94,
    isRecommended: true,
    keyInfo: {
      category: 'Database',
      type: 'Relational (SQL / ACID)',
      license: 'PostgreSQL License (Open Source)',
      learningCurve: 'Medium',
      scalability: 'Excellent',
      ecosystem: 'Very High'
    },
    metrics: {
      popularity: 91,
      easeOfLearning: 70,
      scalability: 94,
      ecosystem: 92
    },
    whyRecommended: [
      'Guarantees strict ACID transactions — vital for preventing double-spending or duplicate food orders',
      'First-class support for relational foreign keys between Students, Cafeterias, Menu Items, and Orders',
      'Extensible with JSONB columns for flexible restaurant menu custom options'
    ],
    benefits: [
      'Bulletproof data consistency under concurrent lunch transactions',
      'Advanced indexing (B-Tree, GIN) for fast menu search and order history filtering',
      'Zero licensing costs with enterprise-grade reliability'
    ],
    tradeOffs: [
      'Requires upfront schema migrations as features evolve',
      'Horizontal sharding is more complex than distributed NoSQL document stores'
    ],
    alternatives: ['MongoDB', 'MySQL', 'Supabase'],
    realWorldUsage: 'Trusted by Spotify, Instagram, and Twitch as their primary transactional datastore.',
    learningResourcesCount: 3
  },
  {
    id: 'tech_jwt',
    name: 'JWT',
    category: 'Authentication',
    tagline: 'Secure and widely used token-based authentication mechanism',
    description: 'Compact, URL-safe means of representing claims between two parties for stateless API authorization.',
    matchScore: 90,
    isRecommended: true,
    keyInfo: {
      category: 'Authentication Protocol',
      type: 'Stateless Bearer Tokens',
      license: 'IETF RFC 7519',
      learningCurve: 'Easy',
      scalability: 'Excellent',
      ecosystem: 'Very High'
    },
    metrics: {
      popularity: 96,
      easeOfLearning: 88,
      scalability: 95,
      ecosystem: 94
    },
    whyRecommended: [
      'Stateless tokens minimize database lookups on every single order or menu fetch',
      'Seamless authorization across both React Web and React Native mobile apps',
      'Integrates cleanly with role-based access control (Student, Restaurant Owner, Admin)'
    ],
    benefits: [
      'Lightweight and cross-domain compatible',
      'Carries role claims directly in payload for immediate route guards',
      'No server-side session memory storage required'
    ],
    tradeOffs: [
      'Token revocation before expiration requires a lightweight token blocklist or short expiry with refresh tokens',
      'Sensitive user data must not be stored in unencrypted claims'
    ],
    alternatives: ['Session Cookies', 'OAuth 2.0 / Auth0', 'Firebase Auth'],
    realWorldUsage: 'Industry standard for modern RESTful and GraphQL APIs.',
    learningResourcesCount: 2
  },
  {
    id: 'tech_razorpay',
    name: 'Razorpay',
    category: 'Payments',
    tagline: 'Popular payment gateway for high-conversion Indian payments',
    description: 'Comprehensive payment stack supporting UPI instant transfers, QR codes, cards, and automated merchant settlements.',
    matchScore: 90,
    isRecommended: true,
    keyInfo: {
      category: 'Fintech / Payments',
      type: 'Payment Gateway & Webhook Service',
      license: 'Proprietary Commercial API',
      learningCurve: 'Easy',
      scalability: 'High',
      ecosystem: 'High'
    },
    metrics: {
      popularity: 94,
      easeOfLearning: 85,
      scalability: 92,
      ecosystem: 90
    },
    whyRecommended: [
      'Top choice for student demographics with 1-click UPI and mobile wallet compatibility',
      'Instant webhook notifications update order statuses reliably upon settlement',
      'Clean sandbox environment for local testing and staged validation'
    ],
    benefits: [
      'Highest transaction success rates for Indian banking channels',
      'Ready-to-use checkout modal widgets for React and React Native',
      'Automated refunds and dispute handling'
    ],
    tradeOffs: [
      'Geographically focused on Indian domestic payments (for international global markets, Stripe is preferred)',
      'Standard per-transaction processing fee'
    ],
    alternatives: ['Stripe', 'Paytm Gateway', 'PhonePe PG'],
    realWorldUsage: 'Used by Swiggy, Zomato partners, and university portals across India.',
    learningResourcesCount: 3
  },
  {
    id: 'tech_docker',
    name: 'Docker',
    category: 'Deployment',
    tagline: 'Containerization for consistent deployment across environments',
    description: 'Packages the backend, database, and background workers into isolated containers ensuring zero environment drift.',
    matchScore: 90,
    isRecommended: true,
    keyInfo: {
      category: 'DevOps / Containerization',
      type: 'OS-level Virtualization',
      license: 'Apache 2.0 / Commercial',
      learningCurve: 'Medium',
      scalability: 'Very High',
      ecosystem: 'Very High'
    },
    metrics: {
      popularity: 95,
      easeOfLearning: 72,
      scalability: 96,
      ecosystem: 97
    },
    whyRecommended: [
      'Ensures identical behavior between developer laptops, staging, and production servers',
      'Spins up complete multi-container environments (Node + Postgres + Redis) with a single command',
      'Simplifies cloud deployments to AWS ECS, DigitalOcean, or Render'
    ],
    benefits: [
      'Isolation eliminates "works on my machine" bugs',
      'Fast spinning up of test fixtures and reproducible builds',
      'Standard container image format for modern cloud infrastructure'
    ],
    tradeOffs: [
      'Container orchestration in large clusters requires Kubernetes or managed container platforms',
      'Slight initial learning curve for Docker Compose networking'
    ],
    alternatives: ['Podman', 'Direct VM Hosting', 'Serverless (Vercel/AWS Lambda)'],
    realWorldUsage: 'Standard infrastructure component across almost all modern software engineering teams.',
    learningResourcesCount: 3
  }
];

export const fallbackComparisons: TechComparisonGroup = {
  category: 'Database',
  title: 'Database Comparison for Food Ordering',
  technologies: [
    {
      name: 'PostgreSQL',
      matchScore: 94,
      dataStructure: 'Structured (Relational SQL)',
      relationships: 'Excellent (Foreign keys, JOINs)',
      scalability: 'Excellent (Read replicas & partitioning)',
      learningCurve: 'Medium',
      bestFor: 'Orders, payments, inventory, strict ACID consistency',
      realWorldUsage: 'DoorDash, Uber, Spotify, Twitch',
      community: 'Massive, long-standing global community',
      isRecommended: true
    },
    {
      name: 'MongoDB',
      matchScore: 82,
      dataStructure: 'Flexible (Document / JSON)',
      relationships: 'Good (Embedding / References)',
      scalability: 'Excellent (Native sharding)',
      learningCurve: 'Easy',
      bestFor: 'Dynamic catalogs, user activity feeds, unstructured logs',
      realWorldUsage: 'Forbes, eBay, Coinbase',
      community: 'Very large and active modern ecosystem',
      isRecommended: false
    },
    {
      name: 'MySQL',
      matchScore: 78,
      dataStructure: 'Structured (Relational SQL)',
      relationships: 'Excellent (Relational constraints)',
      scalability: 'Good (Master-replica replication)',
      learningCurve: 'Medium',
      bestFor: 'Traditional web applications and CMS systems',
      realWorldUsage: 'WordPress, Facebook, Twitter',
      community: 'Massive enterprise and open source presence',
      isRecommended: false
    }
  ]
};

export const fallbackArchitecture: ArchitectureNode[] = [
  {
    id: 'arch_client_web',
    name: 'Web Application',
    layer: 'client',
    layerTitle: 'Client Tier',
    technology: 'React + TypeScript + Vite',
    description: 'Responsive web interface for students, cafeteria staff, and campus administrators.',
    iconName: 'Layout',
    connectsTo: ['arch_backend_api']
  },
  {
    id: 'arch_client_mobile',
    name: 'Mobile App',
    layer: 'client',
    layerTitle: 'Client Tier',
    technology: 'React Native / Expo',
    description: 'Native mobile client for quick campus food pickup alerts and student ordering.',
    iconName: 'Smartphone',
    connectsTo: ['arch_backend_api']
  },
  {
    id: 'arch_backend_api',
    name: 'Backend API Gateway',
    layer: 'api',
    layerTitle: 'API Gateway & Services',
    technology: 'Node.js + Express + TypeScript',
    description: 'RESTful API endpoints handling auth, menu retrieval, order validation, and webhooks.',
    iconName: 'Server',
    connectsTo: ['arch_database', 'arch_payments', 'arch_storage']
  },
  {
    id: 'arch_database',
    name: 'Primary Database',
    layer: 'data',
    layerTitle: 'Data Persistence',
    technology: 'PostgreSQL (ACID Compliant)',
    description: 'Persistent relational datastore for orders, payment status, menus, and user profiles.',
    iconName: 'Database',
    connectsTo: []
  },
  {
    id: 'arch_payments',
    name: 'Payment Processing',
    layer: 'external',
    layerTitle: 'External Integrations',
    technology: 'Razorpay / UPI Gateway',
    description: 'Handles online transactions, escrow, refunds, and webhook confirmation.',
    iconName: 'CreditCard',
    connectsTo: []
  },
  {
    id: 'arch_storage',
    name: 'Cloud Media Storage',
    layer: 'external',
    layerTitle: 'External Integrations',
    technology: 'S3-compatible Object Store',
    description: 'Stores cafeteria dish images, restaurant logos, and downloadable receipts.',
    iconName: 'HardDrive',
    connectsTo: []
  }
];

export const fallbackRoadmap: RoadmapPhase[] = [
  {
    phaseNumber: 1,
    title: 'Phase 1: Foundation',
    duration: '2–3 weeks',
    status: 'completed',
    deliverables: [
      { title: 'Project setup & monorepo architecture', completed: true },
      { title: 'Database schema design & migrations', completed: true },
      { title: 'JWT Authentication & role-based middleware', completed: true },
      { title: 'Base responsive design system and navigation', completed: true }
    ]
  },
  {
    phaseNumber: 2,
    title: 'Phase 2: Core Features',
    duration: '4–6 weeks',
    status: 'in-progress',
    deliverables: [
      { title: 'Cafeteria menu browsing & search filters', completed: true },
      { title: 'Cart management & order placement flow', completed: true },
      { title: 'Restaurant dashboard to accept/reject orders', completed: false },
      { title: 'Razorpay payment gateway & webhook handling', completed: false }
    ]
  },
  {
    phaseNumber: 3,
    title: 'Phase 3: Advanced Features',
    duration: '3–4 weeks',
    status: 'upcoming',
    deliverables: [
      { title: 'Live order tracking with step-by-step progress', completed: false },
      { title: 'Push notifications & SMS alerts', completed: false },
      { title: 'Campus delivery hub batching logic', completed: false },
      { title: 'Admin reporting & cafeteria analytics', completed: false }
    ]
  },
  {
    phaseNumber: 4,
    title: 'Phase 4: Testing & Deployment',
    duration: '2–3 weeks',
    status: 'upcoming',
    deliverables: [
      { title: 'Automated integration & stress testing for peak lunch hours', completed: false },
      { title: 'Security review & PCI payment compliance checklist', completed: false },
      { title: 'Docker containerization & production cloud deployment', completed: false },
      { title: 'Campus pilot rollout & feedback loop', completed: false }
    ]
  }
];

export const fallbackResources: ResourceItem[] = [
  {
    id: 'res_01',
    title: 'React Official Documentation',
    category: 'Official Documentation',
    description: 'Learn the fundamentals, hooks, and modern component patterns for interactive interfaces.',
    technology: 'React',
    url: 'https://react.dev',
    readTimeOrDuration: '15 min read'
  },
  {
    id: 'res_02',
    title: 'React Beginner Guide & State Management',
    category: 'Tutorials',
    description: 'A beginner-friendly introduction to building reactive web forms and carts.',
    technology: 'React',
    url: 'https://react.dev/learn',
    readTimeOrDuration: '25 min read'
  },
  {
    id: 'res_03',
    title: 'Node.js & Express API Design Best Practices',
    category: 'Guides',
    description: 'Structuring scalable RESTful APIs, middleware validation, and centralized error handling.',
    technology: 'Node.js',
    url: 'https://expressjs.com',
    readTimeOrDuration: '20 min read'
  },
  {
    id: 'res_04',
    title: 'PostgreSQL Relational Modeling for E-Commerce',
    category: 'Tutorials',
    description: 'Design foreign key constraints and ACID transaction boundaries for order management.',
    technology: 'PostgreSQL',
    url: 'https://www.postgresql.org/docs/',
    readTimeOrDuration: '30 min read'
  },
  {
    id: 'res_05',
    title: 'Razorpay Payment Gateway Integration Tutorial',
    category: 'YouTube',
    description: 'Video walkthrough implementing UPI checkout widgets and server-side webhook signature verification.',
    technology: 'Razorpay',
    url: 'https://razorpay.com/docs/',
    readTimeOrDuration: '18 min video'
  },
  {
    id: 'res_06',
    title: 'Docker for Developers: From Zero to Containerized API',
    category: 'Examples',
    description: 'Step-by-step example composing Node.js and PostgreSQL in an isolated local environment.',
    technology: 'Docker',
    url: 'https://docs.docker.com',
    readTimeOrDuration: '12 min guide'
  }
];

export const fallbackBlueprint: ProjectBlueprint = {
  projectId: 'proj_college_food_01',
  projectName: 'College Food Ordering Platform',
  generatedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  version: '1.0.0-PROPOSAL',
  sections: [
    { title: 'Project Overview', description: 'Executive summary, target demographics, and problem statement.', status: 'included' },
    { title: 'Requirements Analysis', description: 'Complete functional and non-functional specifications.', status: 'included' },
    { title: 'User Roles & Permissions', description: 'Matrix of student, restaurant vendor, and admin privileges.', status: 'included' },
    { title: 'Key Feature Breakdown', description: 'Detailed user stories from menu browsing to order fulfillment.', status: 'included' },
    { title: 'Recommended Technology Stack', description: 'Technology matches with scoring justification and trade-offs.', status: 'included' },
    { title: 'System Architecture Diagram', description: 'Layer-by-layer interaction between client, API, and datastore.', status: 'included' },
    { title: 'Development Roadmap & Milestones', description: '4-phase sequential timeline with measurable deliverables.', status: 'included' },
    { title: 'Security & Compliance Considerations', description: 'Token safety, payment escrow, and data protection protocol.', status: 'included' },
    { title: 'Curated Learning Resources', description: 'Technical documentation and guides for implementing team.', status: 'included' }
  ]
};

export const fallbackInitialMessages: Message[] = [
  {
    id: 'msg_01',
    projectId: 'proj_college_food_01',
    role: 'assistant',
    content: "Hi! I'm StackMatch. Tell me about the product you want to build. You can describe it in simple words — I'll take care of the technical details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    metadata: {
      stage: 'idea',
      suggestedResponses: [
        'A food ordering app for my college',
        'A fitness tracking platform for personal trainers',
        'A SaaS invoice generator for freelancers'
      ]
    }
  },
  {
    id: 'msg_02',
    projectId: 'proj_college_food_01',
    role: 'user',
    content: 'I want to build a food ordering platform for my college.',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    metadata: {
      stage: 'idea'
    }
  },
  {
    id: 'msg_03',
    projectId: 'proj_college_food_01',
    role: 'assistant',
    content: `That's a great idea. It sounds like you're planning a food ordering platform for students and nearby restaurants.

To understand the project properly, I'd like to clarify a few things:

1. Who will use the platform — students, restaurants, college administrators, or all three?
2. Do you want a website, mobile app, or both?
3. Should students be able to pay online?`,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    metadata: {
      stage: 'requirements',
      suggestedResponses: [
        'Students, restaurants and admin',
        'Both web and mobile',
        'Online payments'
      ]
    }
  }
];
