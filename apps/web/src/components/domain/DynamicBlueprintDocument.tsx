import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  Shield,
  Cpu,
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Globe,
  Database,
  Server,
  Zap,
  Share2,
  Download,
  Printer,
  Loader2,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { TechLogo } from '../brand/techLogos';
import {
  Project,
  Requirement,
  Technology,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
  ProjectRiskItem,
} from '../../types';
import { downloadBlueprintPdf, sanitizeProjectFilename } from '../../utils/pdfExport';

export interface DynamicBlueprintDocumentProps {
  project: Project;
  requirements: Requirement[];
  technologies: Technology[];
  architectureNodes: ArchitectureNode[];
  roadmapPhases: RoadmapPhase[];
  resources?: ResourceItem[];
  risks?: ProjectRiskItem[];
  blueprint?: ProjectBlueprint | null;
  onOpenExportModal?: () => void;
  onOpenShareModal?: () => void;
}

export const DynamicBlueprintDocument: React.FC<DynamicBlueprintDocumentProps> = ({
  project,
  requirements,
  technologies,
  architectureNodes,
  roadmapPhases,
  resources = [],
  risks = [],
  blueprint,
  onOpenExportModal,
  onOpenShareModal,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportStage, setExportStage] = useState('');

  const version = blueprint?.version || '1.0.0-PROPOSAL';
  const generatedDate =
    blueprint?.generatedDate ||
    new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const functionalReqs = requirements.filter((r) => r.type === 'functional');
  const nonFunctionalReqs = requirements.filter((r) => r.type === 'non-functional');

  const defaultChecklist = [
    { id: 'c1', title: 'Functional requirements scoped & prioritized', completed: requirements.length > 0 },
    { id: 'c2', title: 'Target users & role-based permissions documented', completed: (project.summary?.primaryUsers?.length || 0) > 0 },
    { id: 'c3', title: 'Multi-tier system architecture topology mapped', completed: architectureNodes.length > 0 },
    { id: 'c4', title: 'Technology selections approved with suitability scores', completed: technologies.length > 0 },
    { id: 'c5', title: 'Token auth & secret protection strategy established', completed: true },
    { id: 'c6', title: 'Phase-by-phase delivery milestones & timelines mapped', completed: roadmapPhases.length > 0 },
    { id: 'c7', title: 'Acceptance criteria defined for critical user stories', completed: requirements.some((r) => r.acceptanceCriteria?.length) },
    { id: 'c8', title: 'Deployment environment & container strategy specified', completed: true },
    { id: 'c9', title: 'Technical bottlenecks and mitigations cataloged', completed: risks.length > 0 },
    { id: 'c10', title: 'Official documentation and learning guides curated', completed: resources.length > 0 },
  ];

  const checklist = blueprint?.checklist || defaultChecklist;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    setExportStage('Generating PDF...');
    try {
      const filename = sanitizeProjectFilename(project.name);
      await downloadBlueprintPdf(
        {
          project,
          requirements,
          technologies,
          architectureNodes,
          roadmapPhases,
          resources,
          risks,
          blueprint,
        },
        {
          filename,
          onProgress: (stage) => setExportStage(stage),
        }
      );
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setExportStage('Generation failed');
      setTimeout(() => setExportStage(''), 4000);
    } finally {
      setIsExportingPdf(false);
      setTimeout(() => setExportStage(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Print & Export Toolbar (Screen only) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-[#E5E7EB] rounded-xl px-5 py-3 shadow-2xs print:hidden">
        <div className="flex items-center gap-2 text-xs text-[#4B5563]">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
          <span className="font-semibold text-[#111827]">Engineering Blueprint Ready</span>
          <span className="text-[#9CA3AF]">•</span>
          <span>{technologies.length} Technologies</span>
          <span className="text-[#9CA3AF]">•</span>
          <span>{requirements.length} Requirements</span>
          {isExportingPdf && exportStage && (
            <span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200 animate-pulse">
              {exportStage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
              Share Blueprint
            </button>
          )}
          {onOpenExportModal && (
            <button
              type="button"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D1D5DB] bg-white text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#4B5563]" />
              Export Options
            </button>
          )}
          <button
            type="button"
            disabled={isExportingPdf}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-xs font-semibold text-white hover:bg-[#1D4ED8] transition-colors shadow-2xs disabled:opacity-60 cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-white" />
            )}
            {isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#111827] text-xs font-semibold text-white hover:bg-[#1F2937] transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            Print to PDF
          </button>
        </div>
      </div>

      <article
        id="stackmatch-blueprint-doc"
        className="blueprint-print-root bg-white rounded-2xl border border-[#D1D5DB] shadow-lg print:shadow-none print:border-none p-8 sm:p-12 text-[#111827] space-y-10 max-w-5xl mx-auto font-sans print:p-0 print:m-0 print:w-full"
      >
        {/* 1. COVER HEADER */}
        <section className="blueprint-section border-b-2 border-[#111827] pb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
                StackMatch Engineering Specification
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                {project.name}
              </h1>
              <p className="text-sm text-[#4B5563] leading-relaxed max-w-2xl">
                {project.description || 'Not specified'}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB]">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                {project.status.toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[#687280]">
                Version {version} • {generatedDate}
              </span>
              <span className="text-[10px] text-[#9CA3AF]">
                Tagline: Plan smarter. Choose better. Build with confidence.
              </span>
            </div>
          </div>
        </section>

        {/* 2. EXECUTIVE SUMMARY & PROBLEM STATEMENT */}
        <section className="blueprint-section space-y-4">
          <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <span>1. Executive Summary & Problem Statement</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="blueprint-card p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block">Project Type / Category</span>
              <span className="font-bold text-xs text-[#111827] mt-0.5 block">
                {project.category || project.summary?.projectType || 'Web & Mobile Application'}
              </span>
            </div>

            <div className="blueprint-card p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block">Estimated Complexity</span>
              <span className="font-bold text-xs text-[#111827] mt-0.5 block">
                {project.summary?.estimatedComplexity || 'Medium'}
              </span>
            </div>

            <div className="blueprint-card p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block">Delivery Window</span>
              <span className="font-bold text-xs text-[#111827] mt-0.5 block">
                {project.summary?.estimatedTimeline || '3–6 months'}
              </span>
            </div>

            <div className="blueprint-card p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block">Target Users</span>
              <span className="font-bold text-xs text-[#111827] mt-0.5 block truncate">
                {(project.summary?.primaryUsers || ['End Users']).join(', ')}
              </span>
            </div>
          </div>

          <div className="blueprint-card p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
            <span className="text-xs font-bold text-[#111827] block">Problem Statement:</span>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              {project.problemStatement || project.summary?.problemStatement || project.description || 'Not specified'}
            </p>
          </div>

          {project.summary?.goals && project.summary.goals.length > 0 && (
            <div className="blueprint-card p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
              <span className="text-xs font-bold text-[#111827] block">Primary Objectives:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#374151]">
                {project.summary.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 3. REQUIREMENTS & ACCEPTANCE CRITERIA */}
        <section className="blueprint-section space-y-4">
          <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <Layers className="w-4 h-4 text-[#2563EB]" />
            <span>2. Scoped Requirements & Acceptance Criteria ({requirements.length} Items)</span>
          </h2>

          {requirements.length === 0 ? (
            <p className="text-xs text-[#687280] italic">No requirements scoped yet. Pending AI scoping session.</p>
          ) : (
            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div
                  key={req.id}
                  className="blueprint-card p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111827]">
                        {idx + 1}. {req.title}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white border border-[#D1D5DB] text-[#374151]">
                        {req.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          req.priority === 'high'
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : req.priority === 'medium'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#F3F4F6] text-[#4B5563]'
                        }`}
                      >
                        {req.priority} Priority
                      </span>
                      {req.isMvpScope && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#DCFCE7] text-[#16A34A]">
                          MVP
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5563] leading-relaxed">{req.description}</p>

                  {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                    <div className="pt-2 border-t border-[#E5E7EB] space-y-1">
                      <span className="text-[11px] font-semibold text-[#111827] block">
                        Acceptance Criteria:
                      </span>
                      <ul className="space-y-1 text-xs text-[#4B5563]">
                        {req.acceptanceCriteria.map((ac, acIdx) => (
                          <li key={acIdx} className="flex items-start gap-2">
                            <span className="text-[#2563EB] font-bold">✓</span>
                            <span>{ac}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. COMPLETE SELECTED TECHNOLOGY STACK WITH LOGOS */}
        <section className="blueprint-section space-y-4">
          <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <Cpu className="w-4 h-4 text-[#2563EB]" />
            <span>3. Approved Technology Stack with Architectural Roles</span>
          </h2>

          {technologies.length === 0 ? (
            <p className="text-xs text-[#687280] italic">No technologies evaluated yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {technologies.map((tech) => (
                <div
                  key={tech.id}
                  className="blueprint-card p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <TechLogo name={tech.name} size={30} />
                        <div>
                          <h4 className="text-sm font-bold text-[#111827]">{tech.name}</h4>
                          <span className="text-[10px] text-[#687280] font-medium">{tech.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                        {tech.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-[#4B5563] mt-2.5 leading-relaxed">{tech.tagline}</p>

                    {tech.roleInArchitecture && (
                      <div className="mt-2 p-2 rounded bg-white border border-[#E5E7EB] text-[11px] text-[#374151]">
                        <span className="font-bold text-[#111827] block mb-0.5">Role in Architecture:</span>
                        {tech.roleInArchitecture}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB] text-[11px]">
                    <div className="flex items-center justify-between text-[#687280]">
                      <span>Scalability: <strong className="text-[#111827]">{tech.keyInfo.scalability}</strong></span>
                      <span>Learning: <strong className="text-[#111827]">{tech.keyInfo.learningCurve}</strong></span>
                    </div>
                    <div className="text-[10px] text-[#4B5563] italic">
                      Adopted by: {tech.realWorldUsage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. SYSTEM ARCHITECTURE OVERVIEW */}
        <section className="blueprint-section space-y-4">
          <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <Server className="w-4 h-4 text-[#2563EB]" />
            <span>4. Multi-Tier System Architecture Topography</span>
          </h2>

          {architectureNodes.length === 0 ? (
            <p className="text-xs text-[#687280] italic">Architecture topography not yet generated.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {architectureNodes.map((node) => (
                <div
                  key={node.id}
                  className="blueprint-card p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                      {node.layerTitle || node.layer}
                    </span>
                    <span className="text-xs font-bold text-[#111827]">{node.technology}</span>
                  </div>
                  <h5 className="text-xs font-bold text-[#111827] pt-1">{node.name}</h5>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">{node.description}</p>
                  {node.connectsTo && node.connectsTo.length > 0 && (
                    <span className="text-[10px] text-[#687280] block pt-1 border-t border-[#E5E7EB]">
                      Connects to: <strong className="text-[#111827]">{node.connectsTo.join(', ')}</strong>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 6. DEVELOPMENT ROADMAP & MILESTONES */}
        <section className="blueprint-section space-y-4">
          <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <Clock className="w-4 h-4 text-[#2563EB]" />
            <span>5. Sequential Development Roadmap & Acceptance Criteria</span>
          </h2>

          {roadmapPhases.length === 0 ? (
            <p className="text-xs text-[#687280] italic">Roadmap phases not yet generated.</p>
          ) : (
            <div className="space-y-4">
              {roadmapPhases.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="blueprint-card p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs">
                        {phase.phaseNumber}
                      </span>
                      <h4 className="text-sm font-bold text-[#111827]">{phase.title}</h4>
                    </div>
                    <span className="text-xs font-semibold text-[#687280] bg-white px-2.5 py-0.5 rounded border border-[#D1D5DB]">
                      Duration: {phase.duration}
                    </span>
                  </div>

                  {phase.objective && (
                    <p className="text-xs text-[#374151] italic">Objective: {phase.objective}</p>
                  )}

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[#111827] block">Deliverables:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.deliverables.map((del, dIdx) => (
                        <div key={dIdx} className="p-2 rounded bg-white border border-[#E5E7EB] text-xs space-y-1">
                          <span className="font-semibold text-[#111827] block">• {del.title}</span>
                          {del.acceptanceCriteria && del.acceptanceCriteria.length > 0 && (
                            <span className="text-[10px] text-[#687280] block pl-2">
                              Criteria: {del.acceptanceCriteria.join(', ')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 7. TECHNICAL RISKS & MITIGATIONS */}
        {risks.length > 0 && (
          <section className="blueprint-section space-y-4">
            <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>6. Technical Risks & Practical Mitigations</span>
            </h2>

            <div className="space-y-3">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className="blueprint-card p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827]">{risk.title}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        risk.severity === 'high'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {risk.severity} Severity
                    </span>
                  </div>
                  <p className="text-[#4B5563]">{risk.impact}</p>
                  <div className="p-2 rounded bg-white border border-[#E5E7EB] text-[11px] text-[#16A34A] font-medium">
                    <strong>Mitigation:</strong> {risk.practicalMitigation}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. VERIFIED LEARNING RESOURCES */}
        {resources.length > 0 && (
          <section className="blueprint-section space-y-4">
            <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>7. Verified Official Documentation & Guides</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="blueprint-card p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827]">{res.technology}</span>
                    <span className="text-[10px] bg-white text-[#687280] px-2 py-0.5 rounded border border-[#E5E7EB]">
                      {res.category}
                    </span>
                  </div>
                  <p className="text-[#374151] font-medium">{res.title}</p>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#2563EB] hover:underline block truncate"
                  >
                    {res.url}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. IMPLEMENTATION READINESS CHECKLIST */}
        <section className="blueprint-section space-y-4 border-t-2 border-[#E5E7EB] pt-8">
          <h2 className="blueprint-section-header text-base font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E7EB] pb-2">
            <CheckSquare className="w-4 h-4 text-[#16A34A]" />
            <span>8. Implementation Readiness Checklist ({checklist.filter((c) => c.completed).length}/{checklist.length} Verified)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`blueprint-card p-3 rounded-xl border flex items-center gap-3 text-xs ${
                  item.completed
                    ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                    : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#687280]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    item.completed ? 'bg-[#16A34A] text-white' : 'bg-[#E5E7EB] text-[#9CA3AF]'
                  }`}
                >
                  {item.completed ? '✓' : '•'}
                </div>
                <span className="font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* DOCUMENT FOOTER */}
        <footer className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF] print:border-none">
          <div>
            <span>Generated by StackMatch Autonomous Planning Engine</span>
          </div>
          <div>
            <span>Confidential • Prepared for {project.name} Project Team</span>
          </div>
        </footer>
      </article>
    </div>
  );
};
