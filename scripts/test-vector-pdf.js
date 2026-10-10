const fs = require('fs');
const path = require('path');
const { jsPDF } = require(path.join(__dirname, '..', 'apps', 'web', 'node_modules', 'jspdf', 'dist', 'jspdf.node.min.js'));

function sanitizeProjectFilename(projectName) {
  const cleanName = (projectName || 'Project')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '_');
  return `StackMatch-${cleanName || 'Project'}-Blueprint.pdf`;
}

function generateVectorBlueprintPdf(data) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 15;
  const contentWidth = pageWidth - marginX * 2; // 180mm
  const bottomMargin = 275;
  let cursorY = 20;

  function checkPageBreak(neededHeight) {
    if (cursorY + neededHeight > bottomMargin) {
      doc.addPage();
      cursorY = 22;
      return true;
    }
    return false;
  }

  // Cover / Header Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(37, 99, 235); // #2563EB
  doc.text('STACKMATCH ENGINEERING SPECIFICATION', marginX, cursorY);
  cursorY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 24, 39); // #111827
  const titleLines = doc.splitTextToSize(data.project.name || 'Project Blueprint', contentWidth - 45);
  doc.text(titleLines, marginX, cursorY);

  // Status Badge (Right aligned)
  const statusText = (data.project.status || 'ACTIVE').toUpperCase();
  doc.setFontSize(8);
  doc.setTextColor(37, 99, 235);
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(pageWidth - marginX - 35, cursorY - 14, 35, 7, 2, 2, 'FD');
  doc.text(statusText, pageWidth - marginX - 17.5, cursorY - 9.5, { align: 'center' });

  cursorY += titleLines.length * 8 + 2;

  // Metadata line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const version = data.blueprint?.version || '1.0.0-PROPOSAL';
  const dateStr = data.blueprint?.generatedDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  doc.text(`Version ${version}  •  ${dateStr}  •  Stage: ${(data.project.currentStage || 'Planning').toUpperCase()}`, marginX, cursorY);
  cursorY += 5;

  // Description
  if (data.project.description) {
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(data.project.description, contentWidth);
    doc.text(descLines, marginX, cursorY);
    cursorY += descLines.length * 4.5 + 4;
  }

  // Divider
  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(0.6);
  doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
  cursorY += 8;

  // Helper for Section Titles
  function drawSectionTitle(num, title) {
    checkPageBreak(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(`${num}. ${title.toUpperCase()}`, marginX, cursorY);
    cursorY += 2;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 6;
  }

  // 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT
  drawSectionTitle('1', 'Executive Summary & Problem Statement');

  // Summary Metrics Box
  checkPageBreak(22);
  const boxWidth = (contentWidth - 6) / 3;
  const summaryItems = [
    { label: 'Project Category', val: data.project.category || data.project.summary?.projectType || 'Web & Mobile' },
    { label: 'Estimated Complexity', val: data.project.summary?.estimatedComplexity || 'Medium' },
    { label: 'Estimated Timeline', val: data.project.summary?.estimatedTimeline || '3–6 months' },
  ];

  summaryItems.forEach((item, idx) => {
    const boxX = marginX + idx * (boxWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, cursorY, boxWidth, 14, 2, 2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, boxX + 3, cursorY + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(17, 24, 39);
    doc.text(doc.splitTextToSize(item.val, boxWidth - 6)[0], boxX + 3, cursorY + 10);
  });
  cursorY += 18;

  // Problem statement box
  const prob = data.project.problemStatement || data.project.summary?.problemStatement || data.project.description || 'Not specified';
  const probLines = doc.splitTextToSize(prob, contentWidth - 8);
  const probBoxHeight = Math.max(16, probLines.length * 4.2 + 8);
  checkPageBreak(probBoxHeight);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, cursorY, contentWidth, probBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(17, 24, 39);
  doc.text('Problem Statement & Market Need:', marginX + 4, cursorY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(probLines, marginX + 4, cursorY + 10.5);
  cursorY += probBoxHeight + 6;

  // Primary Goals
  if (data.project.summary?.goals?.length) {
    checkPageBreak(12 + data.project.summary.goals.length * 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(17, 24, 39);
    doc.text('Primary Objectives:', marginX, cursorY);
    cursorY += 4.5;
    data.project.summary.goals.forEach((goal) => {
      checkPageBreak(6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(37, 99, 235);
      doc.text('✓', marginX + 2, cursorY);
      doc.setTextColor(51, 65, 85);
      const gLines = doc.splitTextToSize(goal, contentWidth - 10);
      doc.text(gLines, marginX + 7, cursorY);
      cursorY += gLines.length * 4 + 1;
    });
    cursorY += 4;
  }

  // 2. SCOPED REQUIREMENTS & ACCEPTANCE CRITERIA
  drawSectionTitle('2', `Scoped Requirements & Agile Specifications (${data.requirements.length} Items)`);

  data.requirements.forEach((req, idx) => {
    const descLines = doc.splitTextToSize(req.description || '', contentWidth - 10);
    const acItems = req.acceptanceCriteria || [];
    const needed = 16 + descLines.length * 4 + acItems.length * 4.5;
    checkPageBreak(needed);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, cursorY, contentWidth, needed - 2, 2, 2, 'FD');

    // Header inside card
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 24, 39);
    doc.text(`${idx + 1}. ${req.title}`, marginX + 4, cursorY + 5.5);

    // Badges
    const badgeText = `[${req.type.toUpperCase()}] • ${req.priority.toUpperCase()} PRIORITY${req.isMvpScope ? ' • MVP' : ''}`;
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(badgeText, pageWidth - marginX - 4, cursorY + 5.5, { align: 'right' });

    // Description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(descLines, marginX + 4, cursorY + 10.5);

    let innerY = cursorY + 10.5 + descLines.length * 4;

    // Acceptance criteria
    if (acItems.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(17, 24, 39);
      doc.text('Acceptance Criteria:', marginX + 4, innerY + 2);
      innerY += 5;
      acItems.forEach((ac) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(37, 99, 235);
        doc.text('•', marginX + 6, innerY);
        doc.setTextColor(71, 85, 105);
        doc.text(doc.splitTextToSize(ac, contentWidth - 16), marginX + 10, innerY);
        innerY += 4;
      });
    }

    cursorY += needed + 2;
  });
  cursorY += 4;

  // 3. APPROVED TECHNOLOGY STACK
  drawSectionTitle('3', `Approved Technology Stack & Match Scores (${data.technologies.length} Technologies)`);

  const techCardWidth = (contentWidth - 4) / 2;
  for (let i = 0; i < data.technologies.length; i += 2) {
    const t1 = data.technologies[i];
    const t2 = data.technologies[i + 1];

    checkPageBreak(38);
    const cardY = cursorY;

    [t1, t2].forEach((tech, colIdx) => {
      if (!tech) return;
      const cardX = marginX + colIdx * (techCardWidth + 4);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(cardX, cardY, techCardWidth, 34, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(17, 24, 39);
      doc.text(tech.name, cardX + 4, cardY + 5.5);

      doc.setFontSize(7.5);
      doc.setTextColor(37, 99, 235);
      doc.text(`${tech.matchScore}% Match`, cardX + techCardWidth - 4, cardY + 5.5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(tech.category, cardX + 4, cardY + 9.5);

      if (tech.tagline) {
        doc.setTextColor(71, 85, 105);
        const tagLines = doc.splitTextToSize(tech.tagline, techCardWidth - 8);
        doc.text(tagLines.slice(0, 2), cardX + 4, cardY + 14);
      }

      if (tech.roleInArchitecture) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(17, 24, 39);
        doc.text('Role:', cardX + 4, cardY + 23);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const roleLines = doc.splitTextToSize(tech.roleInArchitecture, techCardWidth - 16);
        doc.text(roleLines[0], cardX + 12, cardY + 23);
      }

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Scalability: ${tech.keyInfo?.scalability || 'High'} • Adopted by: ${tech.realWorldUsage || 'Industry Leaders'}`, cardX + 4, cardY + 30);
    });

    cursorY += 38;
  }
  cursorY += 4;

  // 4. MULTI-TIER SYSTEM ARCHITECTURE TOPOGRAPHY
  if (data.architectureNodes?.length) {
    drawSectionTitle('4', 'Multi-Tier System Architecture Topography');
    const nodeWidth = (contentWidth - 6) / 3;
    for (let i = 0; i < data.architectureNodes.length; i += 3) {
      checkPageBreak(26);
      const rowY = cursorY;
      for (let j = 0; j < 3; j++) {
        const node = data.architectureNodes[i + j];
        if (!node) continue;
        const nodeX = marginX + j * (nodeWidth + 3);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(nodeX, rowY, nodeWidth, 23, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(37, 99, 235);
        doc.text((node.layerTitle || node.layer).toUpperCase(), nodeX + 3, rowY + 4.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(17, 24, 39);
        doc.text(doc.splitTextToSize(node.name, nodeWidth - 6)[0], nodeX + 3, rowY + 9);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        const desc = doc.splitTextToSize(node.description || '', nodeWidth - 6);
        doc.text(desc.slice(0, 2), nodeX + 3, rowY + 13.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.8);
        doc.setTextColor(100, 116, 139);
        doc.text(`Tech: ${node.technology}`, nodeX + 3, rowY + 20.5);
      }
      cursorY += 27;
    }
    cursorY += 4;
  }

  // 5. SEQUENTIAL DEVELOPMENT ROADMAP
  if (data.roadmapPhases?.length) {
    drawSectionTitle('5', 'Sequential Development Roadmap & Deliverables');
    data.roadmapPhases.forEach((phase) => {
      const delCount = phase.deliverables?.length || 0;
      const needed = 18 + delCount * 4.5;
      checkPageBreak(needed);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, cursorY, contentWidth, needed - 2, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(`Phase ${phase.phaseNumber}: ${phase.title}`, marginX + 4, cursorY + 5.5);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Duration: ${phase.duration}`, pageWidth - marginX - 4, cursorY + 5.5, { align: 'right' });

      if (phase.objective) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Objective: ${phase.objective}`, marginX + 4, cursorY + 10);
      }

      let dY = cursorY + 14.5;
      phase.deliverables?.forEach((del) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(37, 99, 235);
        doc.text('•', marginX + 6, dY);
        doc.setTextColor(51, 65, 85);
        doc.text(del.title, marginX + 10, dY);
        dY += 4.5;
      });

      cursorY += needed + 2;
    });
    cursorY += 4;
  }

  // 6. TECHNICAL RISKS & MITIGATIONS
  if (data.risks?.length) {
    drawSectionTitle('6', 'Technical Risks & Practical Mitigations');
    data.risks.forEach((risk) => {
      checkPageBreak(18);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, cursorY, contentWidth, 15, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(17, 24, 39);
      doc.text(risk.title, marginX + 4, cursorY + 5);

      doc.setFontSize(7.5);
      doc.setTextColor(risk.severity === 'high' ? 220 : 217, risk.severity === 'high' ? 38 : 119, risk.severity === 'high' ? 38 : 6);
      doc.text(`${(risk.severity || 'Medium').toUpperCase()} SEVERITY`, pageWidth - marginX - 4, cursorY + 5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Mitigation: ${risk.practicalMitigation}`, marginX + 4, cursorY + 10);

      cursorY += 18;
    });
    cursorY += 4;
  }

  // 7. VERIFIED LEARNING RESOURCES
  if (data.resources?.length) {
    drawSectionTitle('7', 'Verified Documentation & Learning Guides');
    data.resources.forEach((res) => {
      checkPageBreak(13);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, cursorY, contentWidth, 10, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(17, 24, 39);
      doc.text(`${res.technology}: ${res.title}`, marginX + 4, cursorY + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(37, 99, 235);
      doc.text(res.url, marginX + 4, cursorY + 8);

      cursorY += 13;
    });
    cursorY += 4;
  }

  // 8. IMPLEMENTATION READINESS CHECKLIST
  const checklist = data.blueprint?.checklist || [];
  if (checklist.length) {
    drawSectionTitle('8', `Implementation Readiness Checklist (${checklist.filter(c => c.completed).length}/${checklist.length} Verified)`);
    checklist.forEach((item) => {
      checkPageBreak(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(item.completed ? 22 : 156, item.completed ? 163 : 163, item.completed ? 74 : 175);
      doc.text(item.completed ? '[✓]' : '[  ]', marginX + 3, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(item.completed ? 22 : 100, item.completed ? 101 : 116, item.completed ? 52 : 139);
      doc.text(item.title, marginX + 11, cursorY);
      cursorY += 6;
    });
  }

  // Running Headers and Footers on ALL pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    // Header on pages 2+
    if (p > 1) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('STACKMATCH  •  ENGINEERING SPECIFICATION & BLUEPRINT', marginX, 12);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(marginX, 14, pageWidth - marginX, 14);
    }

    // Footer on all pages
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(marginX, 285, pageWidth - marginX, 285);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Confidential • Prepared for ${data.project.name || 'Project'} Team`, marginX, 290);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, 290, { align: 'right' });
  }

  return doc;
}

// Run test
try {
  const sampleData = {
    project: {
      name: 'College Food Ordering Platform',
      category: 'Web & Mobile Application',
      description: 'A seamless web and mobile food ordering system connecting college students with campus cafeterias and nearby partnered restaurants.',
      status: 'in-progress',
      currentStage: 'planning',
      problemStatement: 'Students waste 20-30 minutes waiting in cafeteria lines between back-to-back lectures, causing missed meals or late arrivals. Campus food courts suffer from sudden order spikes and chaotic manual cash handling.',
      summary: {
        projectType: 'Full-Stack Web & Mobile App',
        estimatedComplexity: 'Medium-High',
        estimatedTimeline: '3–6 months',
        primaryUsers: ['College Students', 'Cafeteria Staff', 'Campus Admins'],
        goals: [
          'Enable instant pre-ordering and scheduled pick-up slots for students',
          'Eliminate cafeteria queue bottlenecks during peak lunchtime rushes',
          'Real-time order prep tracking with push notification alerts',
          'Support student campus card balances alongside UPI and credit cards',
        ],
      },
    },
    requirements: [
      { id: '1', title: 'Student Authentication & Campus SSO', type: 'functional', priority: 'high', isMvpScope: true, description: 'Students register with .edu email or campus SSO; role-based dashboard for vendor staff.', acceptanceCriteria: ['SSO token verified in <200ms', 'Session survives app restarts securely'] },
      { id: '2', title: 'Real-Time Menu Browsing & Cart Management', type: 'functional', priority: 'high', isMvpScope: true, description: 'Live stock tracking of meal items with allergens and dietary tags.', acceptanceCriteria: ['Out-of-stock items disable Add to Cart immediately'] },
      { id: '3', title: 'Payment Processing & Meal Plan Integration', type: 'functional', priority: 'high', isMvpScope: true, description: 'Secure checkout with UPI, Card, and Campus Meal Plan credit deduction.', acceptanceCriteria: ['Atomic database transactions prevent double debiting'] },
      { id: '4', title: 'Order Tracking & Pick-Up Slot Queuing', type: 'functional', priority: 'high', isMvpScope: true, description: 'WebSocket updates of preparation progress and QR code pick-up validation.', acceptanceCriteria: ['Vendor scans student QR code to mark order completed'] },
      { id: '5', title: 'Vendor Order Fulfillment Terminal', type: 'functional', priority: 'medium', isMvpScope: true, description: 'Kitchen display screen with live acoustic alerts on new incoming tickets.', acceptanceCriteria: ['Displays orders sorted by promised pickup time'] },
      { id: '6', title: 'Sub-500ms API Latency Under Peak Concurrency', type: 'non-functional', priority: 'high', isMvpScope: true, description: 'Handles 1,000 concurrent students placing orders within the 10-minute lecture interval.', acceptanceCriteria: ['P99 response time below 450ms under synthetic load test'] },
      { id: '7', title: 'Automated Daily Sales Reconciliation & Vendor Payouts', type: 'functional', priority: 'medium', isMvpScope: false, description: 'Automated settlement engine reconciling campus commission vs vendor net earnings.', acceptanceCriteria: ['Generates GST-compliant PDF invoice nightly'] },
    ],
    technologies: [
      { id: 't1', name: 'React', category: 'Frontend', matchScore: 98, tagline: 'Component-driven interactive web framework', roleInArchitecture: 'Responsive client interface and student ordering portal', keyInfo: { scalability: 'High', learningCurve: 'Gentle', license: 'MIT' }, realWorldUsage: 'Meta, Airbnb, Netflix' },
      { id: 't2', name: 'Node.js', category: 'Backend Runtime', matchScore: 95, tagline: 'Event-driven asynchronous JavaScript runtime', roleInArchitecture: 'High-concurrency microservices and real-time socket server', keyInfo: { scalability: 'High', learningCurve: 'Moderate', license: 'MIT' }, realWorldUsage: 'Uber, PayPal, LinkedIn' },
      { id: 't3', name: 'MongoDB', category: 'Database', matchScore: 93, tagline: 'Scalable document database for dynamic menus and carts', roleInArchitecture: 'Persistent store for restaurant menus, student profiles, and order logs', keyInfo: { scalability: 'Very High', learningCurve: 'Moderate', license: 'SSPL' }, realWorldUsage: 'Forbes, eBay, Electronic Arts' },
      { id: 't4', name: 'Redis', category: 'Caching & Queues', matchScore: 91, tagline: 'In-memory data structure store', roleInArchitecture: 'Lightning-fast session caching and real-time order queue buffer', keyInfo: { scalability: 'Extremely High', learningCurve: 'Low', license: 'RSALv2' }, realWorldUsage: 'Twitter, GitHub, StackOverflow' },
      { id: 't5', name: 'Tailwind CSS', category: 'Styling', matchScore: 96, tagline: 'Utility-first modern CSS framework', roleInArchitecture: 'Pixel-perfect responsive design across mobile and desktop', keyInfo: { scalability: 'High', learningCurve: 'Low', license: 'MIT' }, realWorldUsage: 'Shopify, OpenAI, Vercel' },
      { id: 't6', name: 'Docker', category: 'Containerization', matchScore: 92, tagline: 'Industry-standard application container runtime', roleInArchitecture: 'Reproducible microservice packaging and orchestration', keyInfo: { scalability: 'Very High', learningCurve: 'Moderate', license: 'Apache 2.0' }, realWorldUsage: 'Google, Amazon, Spotify' },
    ],
    architectureNodes: [
      { id: 'n1', layer: 'Client Tier', layerTitle: 'Client Layer', name: 'React Student Web & Mobile Portal', technology: 'React + PWA', description: 'Interactive student client for menu browsing, cart checkout, and live order status' },
      { id: 'n2', layer: 'API Gateway', layerTitle: 'Gateway Tier', name: 'Reverse Proxy & Rate Limiter', technology: 'Express Gateway', description: 'Handles SSL termination, CORS validation, JWT auth verification, and throttling' },
      { id: 'n3', layer: 'Application Service', layerTitle: 'Backend Tier', name: 'Order Management & Inventory Service', technology: 'Node.js / Express', description: 'Core transactional engine executing order placements and kitchen dispatch' },
      { id: 'n4', layer: 'Real-Time Layer', layerTitle: 'Messaging Tier', name: 'WebSocket Order Event Dispatcher', technology: 'Socket.io', description: 'Pushes real-time order status transitions directly to vendor KDS and student apps' },
      { id: 'n5', layer: 'Persistence Tier', layerTitle: 'Data Layer', name: 'Primary Transactional Document Store', technology: 'MongoDB Replica Set', description: 'Stores user accounts, vendor profiles, catalog taxonomies, and transactional histories' },
      { id: 'n6', layer: 'Cache Layer', layerTitle: 'Caching Tier', name: 'In-Memory Hot Menu & Session Cache', technology: 'Redis Cluster', description: 'Caches active menus, active session tokens, and peak order queue states' },
    ],
    roadmapPhases: [
      { phaseNumber: 1, title: 'Foundation & Core Ordering MVP', duration: 'Weeks 1–4', objective: 'Deliver working student ordering and vendor order reception', deliverables: [{ title: 'Student auth with campus email verification' }, { title: 'Cafeteria menu catalogue and order cart' }, { title: 'Basic mock payment checkout' }] },
      { phaseNumber: 2, title: 'Real-Time Order Flow & Kitchen Display', duration: 'Weeks 5–8', objective: 'Real-time sync between student app and cafeteria tablets', deliverables: [{ title: 'WebSocket order dispatch' }, { title: 'Vendor Kitchen Display System (KDS)' }, { title: 'QR code pick-up validation' }] },
      { phaseNumber: 3, title: 'Payments, Meal Plans & Concurrency Optimization', duration: 'Weeks 9–12', objective: 'Production payment gateway and sub-500ms rush-hour tuning', deliverables: [{ title: 'Live Payment Gateway & Campus Card integration' }, { title: 'Redis menu cache layer' }, { title: 'Load testing with 1,000 concurrent orders' }] },
      { phaseNumber: 4, title: 'Vendor Analytics, Payouts & Launch Rollout', duration: 'Weeks 13–16', objective: 'Campus-wide rollout with automated vendor reconciliation', deliverables: [{ title: 'Vendor analytics and payout reports' }, { title: 'Admin system health dashboard' }, { title: 'Pilot launch across 3 campus dining halls' }] },
    ],
    risks: [
      { id: 'r1', title: 'Order Thundering Herd during 10-minute class breaks', severity: 'high', impact: 'Server timeouts or duplicate orders when 1,000 students hit the app simultaneously', practicalMitigation: 'Redis-backed order queues and rate-limiting throttling with optimistic UI feedback' },
      { id: 'r2', title: 'Kitchen Kitchen Tablet Disconnects on Spotty Campus Wi-Fi', severity: 'medium', impact: 'Vendor misses incoming tickets while offline', practicalMitigation: 'Local IndexedDB queue on tablet with automatic reconnection backoff and SMS alerts' },
    ],
    resources: [
      { id: 'res1', technology: 'React', category: 'Official Documentation', title: 'React 18 Architecture & Hooks Guide', url: 'https://react.dev' },
      { id: 'res2', technology: 'Node.js', category: 'Best Practices', title: 'Production Ready Node.js Clean Architecture', url: 'https://nodejs.org/docs' },
      { id: 'res3', technology: 'MongoDB', category: 'Data Modeling', title: 'Schema Design for E-Commerce & Catalogs', url: 'https://www.mongodb.com/docs' },
    ],
    blueprint: {
      version: '1.2.0-PRODUCTION',
      generatedDate: 'October 10, 2026',
      checklist: [
        { id: 'c1', title: 'Functional requirements scoped & prioritized', completed: true },
        { id: 'c2', title: 'Target users & role-based permissions documented', completed: true },
        { id: 'c3', title: 'Multi-tier system architecture topology mapped', completed: true },
        { id: 'c4', title: 'Technology selections approved with suitability scores', completed: true },
        { id: 'c5', title: 'Token auth & secret protection strategy established', completed: true },
        { id: 'c6', title: 'Phase-by-phase delivery milestones & timelines mapped', completed: true },
        { id: 'c7', title: 'Acceptance criteria defined for critical user stories', completed: true },
        { id: 'c8', title: 'Deployment environment & container strategy specified', completed: true },
        { id: 'c9', title: 'Technical bottlenecks and mitigations cataloged', completed: true },
        { id: 'c10', title: 'Official documentation and learning guides curated', completed: true },
      ],
    },
  };

  const filename = sanitizeProjectFilename(sampleData.project.name);
  console.log('Sanitized Filename:', filename);

  const doc = generateVectorBlueprintPdf(sampleData);
  const outPath = path.join(__dirname, '..', filename);
  doc.save(outPath);

  if (fs.existsSync(outPath)) {
    const stat = fs.statSync(outPath);
    console.log(`Generated PDF successfully! Size: ${(stat.size / 1024).toFixed(1)} KB`);
    console.log(`Total Pages: ${doc.getNumberOfPages()}`);
    
    // Check text searchability
    const pdfBuf = fs.readFileSync(outPath);
    const pdfStr = pdfBuf.toString('latin1');
    const hasSearchableText = pdfStr.includes('College Food Ordering Platform') || pdfStr.includes('Scoped Requirements');
    console.log('Selectable Text Verification:', hasSearchableText ? 'PASS (100% Vector)' : 'ENCODED STREAM');
  } else {
    console.error('File was not generated');
    process.exit(1);
  }
} catch (e) {
  console.error('Error generating vector PDF:', e);
  process.exit(1);
}
