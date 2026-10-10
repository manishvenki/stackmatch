import React, { useState } from 'react';
import {
  MessageSquare,
  Edit3,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  FileCheck,
  Zap,
  Plus,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { RequirementCard } from '../components/domain/RequirementCard';
import { TechnologyCard } from '../components/domain/TechnologyCard';
import { ComparisonTable } from '../components/domain/ComparisonTable';
import { ArchitectureDiagram } from '../components/domain/ArchitectureDiagram';
import { RoadmapTimeline } from '../components/domain/RoadmapTimeline';
import { ResourceCard } from '../components/domain/ResourceCard';
import { EditRequirementModal } from '../components/domain/EditRequirementModal';
import {
  Project,
  Requirement,
  Technology,
  TechComparisonGroup,
  ArchitectureNode,
  RoadmapPhase,
  ResourceItem,
  ProjectBlueprint,
} from '../types';

export interface ProjectOverviewPageProps {
  project: Project;
  requirements: Requirement[];
  technologies: Technology[];
  comparisonGroup: TechComparisonGroup;
  architectureNodes: ArchitectureNode[];
  roadmapPhases: RoadmapPhase[];
  resources: ResourceItem[];
  blueprint: ProjectBlueprint;
  initialTab?: string;
  onOpenChat: () => void;
  onOpenMobileSidebar?: () => void;
  onUpdateRequirement?: (updatedReq: Partial<Requirement> & { id: string }) => Promise<void>;
  onDeleteRequirement?: (requirementId: string) => Promise<void>;
  onAddRequirement?: (newReq: Omit<Requirement, 'id' | 'projectId'>) => Promise<void>;
}

export const ProjectOverviewPage: React.FC<ProjectOverviewPageProps> = ({
  project,
  requirements,
  technologies,
  comparisonGroup,
  architectureNodes,
  roadmapPhases,
  resources,
  blueprint,
  initialTab = 'overview',
  onOpenChat,
  onUpdateRequirement,
  onDeleteRequirement,
  onAddRequirement,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedTech, setSelectedTech] = useState<Technology>(
    technologies.find((t) => t.name === 'PostgreSQL') || technologies[0] || ({} as Technology)
  );
  const [techDetailTab, setTechDetailTab] = useState<'overview' | 'why' | 'benefits' | 'tradeoffs' | 'alternatives' | 'realworld' | 'learn'>('overview');
  const [requirementFilter, setRequirementFilter] = useState<'all' | 'functional' | 'non-functional' | 'mvp'>('all');

  // Requirement Modal State
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'requirements', label: 'Requirements', count: requirements.length },
    { id: 'tech-stack', label: 'Tech Stack', count: technologies.length },
    { id: 'tech-details', label: 'Technology Details' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'resources', label: 'Resources', count: resources.length },
    { id: 'blueprint', label: 'Blueprint' },
  ];

  const filteredRequirements = requirements.filter((r) => {
    if (requirementFilter === 'all') return true;
    if (requirementFilter === 'mvp') return !!r.isMvpScope;
    return r.type === requirementFilter;
  });

  const handleEditReq = (req: Requirement) => {
    setEditingRequirement(req);
    setIsEditModalOpen(true);
  };

  const handleNewReq = () => {
    const dummyReq: Requirement = {
      id: `req_${Date.now()}`,
      projectId: project.id,
      title: '',
      description: '',
      type: 'functional',
      priority: 'medium',
      isMvpScope: true,
      category: 'Core Features',
    };
    setEditingRequirement(dummyReq);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9FAFB] overflow-y-auto">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-8 pt-6 pb-0 shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="highlight" size="sm">
                  {project.currentStage.toUpperCase()}
                </Badge>
                <span className="text-xs text-[#16A34A] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                  Verified Plan
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                {project.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#687280] mt-1 max-w-2xl">
                {project.description}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                onClick={onOpenChat}
              >
                AI Scoping Chat
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileCheck className="w-3.5 h-3.5" />}
                onClick={() => setActiveTab('blueprint')}
              >
                Project Blueprint
              </Button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Summary Card */}
              <Card className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                  <h3 className="text-base font-bold text-[#111827]">Project Summary</h3>
                  <Badge variant="neutral">Verified Scope</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                      Project Type
                    </span>
                    <span className="font-bold text-[#111827] text-sm">
                      {project.summary?.projectType || 'Web & Mobile Application'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                      Primary Users
                    </span>
                    <span className="font-bold text-[#111827] text-sm">
                      {project.summary?.primaryUsers?.join(', ') || 'End Users, Administrators'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                      Industry
                    </span>
                    <span className="font-bold text-[#111827] text-sm">
                      {project.summary?.industry || 'Software & Technology'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                      Estimated Complexity
                    </span>
                    <span className="font-bold text-[#111827] text-sm">
                      {project.summary?.estimatedComplexity || 'Medium'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-[#687280] uppercase tracking-wider block mb-2">
                    Key Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {project.summary?.keyFeatures?.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-3 py-1 bg-[#F3F4F6] text-[#374151] rounded-md border border-[#E5E7EB]"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-xs text-[#687280]">
                  <span>Estimated Delivery Window:</span>
                  <span className="font-bold text-[#111827] text-sm">
                    {project.summary?.estimatedTimeline || '3–6 months'}
                  </span>
                </div>
              </Card>

              {/* Target Audience & Quick Stats */}
              <div className="space-y-6">
                <Card>
                  <h3 className="text-sm font-bold text-[#111827] mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#687280]" />
                    <span>Target Audience</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.summary?.targetAudience?.map((audience, idx) => (
                      <Badge key={idx} variant="highlight" size="md">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Quick Shortcuts to planning views */}
                <Card className="bg-[#111827] text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <h4 className="text-sm font-bold">StackMatch Blueprint</h4>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-4 leading-relaxed">
                    All requirements, architecture diagrams, and roadmap phases have been organized into a unified proposal.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-semibold"
                    onClick={() => setActiveTab('blueprint')}
                  >
                    View Blueprint Preview
                  </Button>
                </Card>
              </div>
            </div>

            {/* Project Goals Card */}
            <Card>
              <h3 className="text-base font-bold text-[#111827] mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#111827]" />
                <span>Project Goals</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {project.summary?.goals?.map((goal, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#374151]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{goal}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 2. REQUIREMENTS TAB */}
        {activeTab === 'requirements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Project Requirements</h2>
                <p className="text-xs text-[#687280]">
                  Verified functional and non-functional specifications. Click any card to edit details or toggle MVP scope.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Requirement Filters */}
                <div className="inline-flex rounded-lg border border-[#D1D5DB] bg-white p-1 text-xs">
                  <button
                    onClick={() => setRequirementFilter('all')}
                    className={`px-3 py-1 rounded-md font-medium transition-subtle cursor-pointer ${
                      requirementFilter === 'all'
                        ? 'bg-[#111827] text-white'
                        : 'text-[#687280] hover:text-[#111827]'
                    }`}
                  >
                    All ({requirements.length})
                  </button>
                  <button
                    onClick={() => setRequirementFilter('mvp')}
                    className={`px-3 py-1 rounded-md font-medium transition-subtle cursor-pointer ${
                      requirementFilter === 'mvp'
                        ? 'bg-[#111827] text-white'
                        : 'text-[#687280] hover:text-[#111827]'
                    }`}
                  >
                    MVP Scope
                  </button>
                  <button
                    onClick={() => setRequirementFilter('functional')}
                    className={`px-3 py-1 rounded-md font-medium transition-subtle cursor-pointer ${
                      requirementFilter === 'functional'
                        ? 'bg-[#111827] text-white'
                        : 'text-[#687280] hover:text-[#111827]'
                    }`}
                  >
                    Functional
                  </button>
                  <button
                    onClick={() => setRequirementFilter('non-functional')}
                    className={`px-3 py-1 rounded-md font-medium transition-subtle cursor-pointer ${
                      requirementFilter === 'non-functional'
                        ? 'bg-[#111827] text-white'
                        : 'text-[#687280] hover:text-[#111827]'
                    }`}
                  >
                    Non-Functional
                  </button>
                </div>

                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleNewReq}
                >
                  Add Requirement
                </Button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRequirements.map((req) => (
                <RequirementCard
                  key={req.id}
                  requirement={req}
                  onEdit={handleEditReq}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. TECH STACK TAB */}
        {activeTab === 'tech-stack' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Recommended Tech Stack</h2>
                <p className="text-xs text-[#687280]">
                  StackMatch Suitability Assessments calculated specifically for {project.name}.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('comparison')}
              >
                Side-by-Side Comparison
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {technologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  technology={tech}
                  onViewDetails={(t) => {
                    setSelectedTech(t);
                    setActiveTab('tech-details');
                  }}
                  onCompare={() => setActiveTab('comparison')}
                />
              ))}
            </div>
          </div>
        )}

        {/* 4. TECHNOLOGY DETAILS TAB */}
        {activeTab === 'tech-details' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Technology Selector Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5E7EB]">
              <span className="text-xs font-semibold text-[#687280] uppercase tracking-wider shrink-0 mr-2">
                Select Tech:
              </span>
              {technologies.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTech(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-subtle shrink-0 cursor-pointer ${
                    selectedTech?.id === t.id
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Header of Selected Tech */}
            {selectedTech?.id && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="neutral">{selectedTech.category}</Badge>
                    <span className="text-xs text-[#687280] font-medium">{selectedTech.keyInfo?.type}</span>
                    {selectedTech.keyInfo?.costProfile && (
                      <span className="text-xs text-[#16A34A] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                        {selectedTech.keyInfo.costProfile}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-extrabold text-[#111827]">
                    {selectedTech.name}
                  </h2>
                  <p className="text-xs text-[#687280] mt-0.5">
                    {selectedTech.tagline}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="highlight" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-white" />}>
                    {selectedTech.matchScore}% Suitability Match
                  </Badge>
                  <p className="text-[10px] text-[#9CA3AF] mt-1">StackMatch Suitability Assessment</p>
                </div>
              </div>
            )}

            {/* Deep Tabs */}
            {selectedTech?.id && (
              <>
                <div className="border-b border-[#E5E7EB] flex gap-2 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'why', label: 'Why Recommended' },
                    { id: 'benefits', label: 'Benefits' },
                    { id: 'tradeoffs', label: 'Trade-offs' },
                    { id: 'alternatives', label: 'Alternatives' },
                    { id: 'realworld', label: 'Real-world Usage' },
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setTechDetailTab(subTab.id as any)}
                      className={`px-3 py-2 text-xs font-semibold border-b-2 transition-subtle cursor-pointer ${
                        techDetailTab === subTab.id
                          ? 'border-[#111827] text-[#111827]'
                          : 'border-transparent text-[#687280] hover:text-[#111827]'
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    {techDetailTab === 'overview' && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#111827]">About {selectedTech.name}</h4>
                        <p className="text-xs sm:text-sm text-[#374151] leading-relaxed">
                          {selectedTech.description}
                        </p>
                        <div className="pt-3 border-t border-[#F3F4F6]">
                          <h5 className="text-xs font-semibold text-[#687280] uppercase tracking-wider mb-2">
                            Real-world adoption
                          </h5>
                          <p className="text-xs text-[#374151] bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                            {selectedTech.realWorldUsage}
                          </p>
                        </div>
                      </div>
                    )}

                    {techDetailTab === 'why' && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#111827]">Why Recommended for {project.name}</h4>
                        <ul className="space-y-2">
                          {selectedTech.whyRecommended?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {techDetailTab === 'benefits' && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#111827]">Key Engineering Benefits</h4>
                        <ul className="space-y-2">
                          {selectedTech.benefits?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {techDetailTab === 'tradeoffs' && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#111827]">Considered Trade-offs</h4>
                        <ul className="space-y-2">
                          {selectedTech.tradeOffs?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#B91C1C] bg-[#FEF2F2] p-2.5 rounded-lg border border-[#FEE2E2]">
                              <span>•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {techDetailTab === 'alternatives' && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#111827]">Evaluated Alternatives</h4>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {selectedTech.alternatives?.map((alt, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] text-xs font-semibold text-[#374151]">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {techDetailTab === 'realworld' && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#111827]">Production Case Studies</h4>
                        <p className="text-xs text-[#374151] leading-relaxed">
                          {selectedTech.realWorldUsage}
                        </p>
                      </div>
                    )}
                  </Card>

                  {/* Key Information & Metrics */}
                  <div className="space-y-6">
                    <Card>
                      <h4 className="text-xs font-bold text-[#687280] uppercase tracking-wider mb-3">
                        Key Information
                      </h4>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                          <span className="text-[#687280]">Category</span>
                          <span className="font-semibold text-[#111827]">{selectedTech.keyInfo?.category}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                          <span className="text-[#687280]">Type</span>
                          <span className="font-semibold text-[#111827]">{selectedTech.keyInfo?.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                          <span className="text-[#687280]">License</span>
                          <span className="font-semibold text-[#111827]">{selectedTech.keyInfo?.license}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                          <span className="text-[#687280]">Learning Curve</span>
                          <span className="font-semibold text-[#111827]">{selectedTech.keyInfo?.learningCurve}</span>
                        </div>
                        <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                          <span className="text-[#687280]">Scalability</span>
                          <span className="font-semibold text-[#111827]">{selectedTech.keyInfo?.scalability}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#687280]">Ecosystem</span>
                          <span className="font-semibold text-[#111827]">{selectedTech.keyInfo?.ecosystem}</span>
                        </div>
                      </div>
                    </Card>

                    <Card>
                      <h4 className="text-xs font-bold text-[#687280] uppercase tracking-wider mb-3">
                        Technology Metrics
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between text-[#374151] mb-1 font-medium">
                            <span>Popularity</span>
                            <span className="font-bold">{selectedTech.metrics?.popularity}%</span>
                          </div>
                          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#111827] h-1.5 rounded-full" style={{ width: `${selectedTech.metrics?.popularity}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[#374151] mb-1 font-medium">
                            <span>Ease of Learning</span>
                            <span className="font-bold">{selectedTech.metrics?.easeOfLearning}%</span>
                          </div>
                          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#111827] h-1.5 rounded-full" style={{ width: `${selectedTech.metrics?.easeOfLearning}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[#374151] mb-1 font-medium">
                            <span>Scalability</span>
                            <span className="font-bold">{selectedTech.metrics?.scalability}%</span>
                          </div>
                          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#111827] h-1.5 rounded-full" style={{ width: `${selectedTech.metrics?.scalability}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[#374151] mb-1 font-medium">
                            <span>Ecosystem</span>
                            <span className="font-bold">{selectedTech.metrics?.ecosystem}%</span>
                          </div>
                          <div className="w-full bg-[#E5E7EB] rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#111827] h-1.5 rounded-full" style={{ width: `${selectedTech.metrics?.ecosystem}%` }} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. COMPARISON TAB */}
        {activeTab === 'comparison' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">{comparisonGroup.title}</h2>
              <p className="text-xs text-[#687280]">
                Side-by-side trade-off evaluation matrix comparing candidate solutions.
              </p>
            </div>
            <ComparisonTable comparisonGroup={comparisonGroup} />
          </div>
        )}

        {/* 6. ARCHITECTURE TAB */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">System Architecture</h2>
              <p className="text-xs text-[#687280]">
                Tiered service layout and component communication topography.
              </p>
            </div>
            <ArchitectureDiagram nodes={architectureNodes} />
          </div>
        )}

        {/* 7. ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">Development Roadmap</h2>
              <p className="text-xs text-[#687280]">
                Sequential 4-phase rollout timeline with measurable deliverables.
              </p>
            </div>
            <RoadmapTimeline phases={roadmapPhases} />
          </div>
        )}

        {/* 8. RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-[#111827]">Learning Resources</h2>
              <p className="text-xs text-[#687280]">
                Handpicked documentation, tutorials, and implementation guides for the recommended stack.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          </div>
        )}

        {/* 9. BLUEPRINT PREVIEW TAB */}
        {activeTab === 'blueprint' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Final Project Blueprint</h2>
                <p className="text-xs text-[#687280]">
                  Complete project requirements, technology recommendations, architecture and development roadmap.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="neutral">Phase 2 Preview Ready</Badge>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<FileCheck className="w-4 h-4" />}
                  onClick={() => alert('PDF Blueprint compilation engine is scheduled for Phase 3. Real-time blueprint preview is live!')}
                >
                  Download PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Document Preview Sheet */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#D1D5DB] shadow-lg p-8 sm:p-10 font-sans space-y-6">
                <div className="border-b border-[#E5E7EB] pb-5 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-[#687280] uppercase tracking-wider block">
                      StackMatch Engineering Blueprint
                    </span>
                    <h3 className="text-2xl font-black text-[#111827] mt-1">{blueprint.projectName}</h3>
                    <p className="text-xs text-[#687280] mt-0.5">Version: {blueprint.version} • {blueprint.generatedDate}</p>
                  </div>
                  <Badge variant="highlight">Approved Spec</Badge>
                </div>

                {/* Blueprint Sections Summary */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                    Executive Document Contents
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {blueprint.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#111827]">{idx + 1}. {sec.title}</span>
                          </div>
                          <p className="text-xs text-[#687280] mt-0.5">{sec.description}</p>
                        </div>
                        <Badge variant="success" size="sm">Ready</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What's Included Card */}
              <Card className="h-fit space-y-4">
                <h4 className="text-sm font-bold text-[#111827]">What's Included</h4>
                <div className="space-y-2.5 text-xs text-[#374151]">
                  {[
                    'Project Overview & Executive Summary',
                    'Requirements Analysis (Functional & Non-Functional)',
                    'User Roles & Security Permissions',
                    'Feature Matrix with Acceptance Criteria',
                    'Technology Stack Justification & Trade-offs',
                    'System Architecture Visual Topography',
                    '4-Phase Development Milestones',
                    'Security & Compliance Safeguards',
                    'Curated Implementation Resources',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#F3F4F6]">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs font-semibold"
                    onClick={() => alert('PDF generation is scheduled for Phase 3. Live blueprint data is saved in your project state.')}
                  >
                    Download PDF Blueprint
                  </Button>
                  <p className="text-[10px] text-center text-[#9CA3AF] mt-2">
                    PDF compilation engine scheduled for Phase 3
                  </p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Edit Requirement Modal */}
      {editingRequirement && (
        <EditRequirementModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingRequirement(null);
          }}
          requirement={editingRequirement}
          onSave={async (updated) => {
            if (onUpdateRequirement) {
              await onUpdateRequirement(updated);
            }
          }}
          onDelete={async (id) => {
            if (onDeleteRequirement) {
              await onDeleteRequirement(id);
            }
          }}
        />
      )}
    </div>
  );
};
