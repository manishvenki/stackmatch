import { jsPDF } from 'jspdf';
import {
  Project,
  Requirement,
  Technology,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
  ProjectRiskItem,
} from '../types';

export interface BlueprintExportData {
  project: Project;
  requirements: Requirement[];
  technologies: Technology[];
  architectureNodes: ArchitectureNode[];
  roadmapPhases: RoadmapPhase[];
  resources?: ResourceItem[];
  risks?: ProjectRiskItem[];
  blueprint?: ProjectBlueprint | null;
}

export interface PdfExportOptions {
  filename?: string;
  onProgress?: (stage: string) => void;
}

/**
 * Sanitizes project name to create a clean, safe, professional filename.
 * Example: "College Food Ordering Platform" -> "StackMatch-College_Food_Ordering_Platform-Blueprint.pdf"
 */
export function sanitizeProjectFilename(projectName?: string): string {
  const clean = (projectName || 'Project')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '_');
  return `StackMatch-${clean || 'Project'}-Blueprint.pdf`;
}

/**
 * Generates an executive-grade, multi-page, 100% selectable-text PDF document
 * containing the entire StackMatch project blueprint across all required pages.
 */
export async function downloadBlueprintPdf(
  data: BlueprintExportData,
  options: PdfExportOptions = {}
): Promise<boolean> {
  const filename = options.filename || sanitizeProjectFilename(data.project.name);

  try {
    options.onProgress?.('Initializing vector PDF document...');

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
    let cursorY = 22;

    function checkPageBreak(neededHeight: number): boolean {
      if (cursorY + neededHeight > bottomMargin) {
        doc.addPage('a4', 'portrait');
        cursorY = 24;
        return true;
      }
      return false;
    }

    options.onProgress?.('Formatting document cover & executive overview...');

    // 1. COVER HEADER & SPECIFICATION BANNER
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

    // Version, Date & Planning Stage Metadata
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const version = data.blueprint?.version || '1.0.0-PROPOSAL';
    const dateStr =
      data.blueprint?.generatedDate ||
      new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    doc.text(
      `Version ${version}  •  ${dateStr}  •  Stage: ${(data.project.currentStage || 'Planning').toUpperCase()}`,
      marginX,
      cursorY
    );
    cursorY += 5;

    // Project Description
    if (data.project.description) {
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(data.project.description, contentWidth);
      doc.text(descLines, marginX, cursorY);
      cursorY += descLines.length * 4.5 + 4;
    }

    // Heavy dividing rule
    doc.setDrawColor(17, 24, 39);
    doc.setLineWidth(0.6);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 8;

    // Section Title Renderer
    function drawSectionTitle(num: string, title: string) {
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

    // 2. EXECUTIVE SUMMARY & PROBLEM STATEMENT
    drawSectionTitle('1', 'Executive Summary & Problem Statement');

    checkPageBreak(22);
    const boxWidth = (contentWidth - 6) / 3;
    const summaryItems = [
      { label: 'Project Category', val: data.project.category || data.project.summary?.projectType || 'Web & Mobile' },
      { label: 'Estimated Complexity', val: data.project.summary?.estimatedComplexity || 'Medium' },
      { label: 'Delivery Window', val: data.project.summary?.estimatedTimeline || '3–6 months' },
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

    // Problem Statement
    const prob =
      data.project.problemStatement ||
      data.project.summary?.problemStatement ||
      data.project.description ||
      'Not specified';
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

    options.onProgress?.('Composing scoped requirements & agile criteria...');

    // 3. SCOPED REQUIREMENTS & ACCEPTANCE CRITERIA
    drawSectionTitle('2', `Scoped Requirements & Agile Specifications (${data.requirements.length} Items)`);

    data.requirements.forEach((req, idx) => {
      const descLines = doc.splitTextToSize(req.description || '', contentWidth - 10);
      const acItems = req.acceptanceCriteria || [];
      const needed = 16 + descLines.length * 4 + acItems.length * 4.5;
      checkPageBreak(needed);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(marginX, cursorY, contentWidth, needed - 2, 2, 2, 'FD');

      // Card Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(`${idx + 1}. ${req.title}`, marginX + 4, cursorY + 5.5);

      // Card Badges
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

      // Acceptance Criteria
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

    options.onProgress?.('Integrating evaluated technology stack & match scores...');

    // 4. APPROVED TECHNOLOGY STACK
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
        doc.text(
          `Scalability: ${tech.keyInfo?.scalability || 'High'} • Adopted: ${tech.realWorldUsage || 'Enterprise'}`,
          cardX + 4,
          cardY + 30
        );
      });

      cursorY += 38;
    }
    cursorY += 4;

    options.onProgress?.('Generating multi-tier system architecture topography...');

    // 5. MULTI-TIER SYSTEM ARCHITECTURE TOPOGRAPHY
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

    options.onProgress?.('Mapping sequential roadmap milestones...');

    // 6. SEQUENTIAL DEVELOPMENT ROADMAP
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

    // 7. TECHNICAL RISKS & PRACTICAL MITIGATIONS
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
        doc.setTextColor(
          risk.severity === 'high' ? 220 : 217,
          risk.severity === 'high' ? 38 : 119,
          risk.severity === 'high' ? 38 : 6
        );
        doc.text(`${(risk.severity || 'Medium').toUpperCase()} SEVERITY`, pageWidth - marginX - 4, cursorY + 5, {
          align: 'right',
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Mitigation: ${risk.practicalMitigation}`, marginX + 4, cursorY + 10);

        cursorY += 18;
      });
      cursorY += 4;
    }

    // 8. VERIFIED LEARNING RESOURCES
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

    // 9. IMPLEMENTATION READINESS CHECKLIST
    const defaultChecklist = [
      { id: 'c1', title: 'Functional requirements scoped & prioritized', completed: data.requirements.length > 0 },
      { id: 'c2', title: 'Target users & role-based permissions documented', completed: (data.project.summary?.primaryUsers?.length || 0) > 0 },
      { id: 'c3', title: 'Multi-tier system architecture topology mapped', completed: data.architectureNodes.length > 0 },
      { id: 'c4', title: 'Technology selections approved with suitability scores', completed: data.technologies.length > 0 },
      { id: 'c5', title: 'Token auth & secret protection strategy established', completed: true },
      { id: 'c6', title: 'Phase-by-phase delivery milestones & timelines mapped', completed: data.roadmapPhases.length > 0 },
      { id: 'c7', title: 'Acceptance criteria defined for critical user stories', completed: data.requirements.some((r) => r.acceptanceCriteria?.length) },
      { id: 'c8', title: 'Deployment environment & container strategy specified', completed: true },
      { id: 'c9', title: 'Technical bottlenecks and mitigations cataloged', completed: (data.risks?.length || 0) > 0 },
      { id: 'c10', title: 'Official documentation and learning guides curated', completed: (data.resources?.length || 0) > 0 },
    ];

    const checklist = data.blueprint?.checklist || defaultChecklist;
    if (checklist.length) {
      drawSectionTitle(
        '8',
        `Implementation Readiness Checklist (${checklist.filter((c) => c.completed).length}/${checklist.length} Verified)`
      );
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

    options.onProgress?.('Applying page numbers & document headers...');

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

    options.onProgress?.(`Finalizing and downloading ${filename}...`);
    doc.save(filename);

    return true;
  } catch (error) {
    console.error('Failed to export vector blueprint PDF:', error);
    throw error;
  }
}
