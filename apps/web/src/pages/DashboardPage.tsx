import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Milestone,
  CheckCircle2,
  Clock,
  ExternalLink,
  Users,
  Search,
  Filter,
  Edit3,
  Trash2,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Project, User, ProjectStatus } from '../types';

export interface DashboardPageProps {
  currentUser: User | null;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
  onContinueChat: (project: Project) => void;
  onNavigateConnect?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  projects,
  onSelectProject,
  onNewProject,
  onEditProject,
  onDeleteProject,
  onContinueChat,
  onNavigateConnect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');

  const stageVariant = {
    idea: 'neutral',
    requirements: 'highlight',
    planning: 'warning',
    finalize: 'success',
  } as const;

  const stageLabels = {
    idea: 'Idea & Discussion',
    requirements: 'Requirements Scoping',
    planning: 'Architecture & Stack',
    finalize: 'Complete Blueprint Ready',
  };

  const filteredProjects = projects
    .filter((proj) => {
      const matchesSearch =
        proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proj.description && proj.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (proj.category && proj.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="flex-1 bg-[#F9FAFB] overflow-y-auto p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#687280]">StackMatch Intelligence Hub</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Welcome back{currentUser?.name ? `, ${currentUser.name}` : ''}
            </h1>
            <p className="text-xs sm:text-sm text-[#687280] max-w-xl">
              Turn ideas into production-ready project plans. Define requirements, evaluate technology trade-offs, and generate structured architecture.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="accent"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onNewProject}
              className="font-bold shadow-xs"
            >
              Start New Plan
            </Button>
          </div>
        </div>

        {/* Real Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#687280] block">Active Projects</span>
            <span className="text-2xl font-bold text-[#111827] mt-1 block">{projects.length}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#687280] block">Latest Stage</span>
            <span className="text-sm font-bold text-[#111827] mt-2 block truncate">
              {projects.length > 0 ? stageLabels[projects[0].currentStage] : 'None'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#687280] block">AI Engine</span>
            <span className="text-sm font-bold text-[#16A34A] mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" /> Ready for Scoping
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#687280] block">Marketplace Hub</span>
            <span className="text-sm font-bold text-[#D97706] mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D97706]" /> Connect (Soon)
            </span>
          </div>
        </div>

        {/* Projects Section with Search, Filtering & Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Your Planned Projects</h2>
              <p className="text-xs text-[#687280]">
                Manage saved concepts, refine requirements, and export blueprints.
              </p>
            </div>
            {projects.length > 0 && (
              <Button variant="accent" size="sm" onClick={onNewProject} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Create Project
              </Button>
            )}
          </div>

          {/* Search & Filter Controls */}
          {projects.length > 0 && (
            <div className="bg-white p-3 rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects by name, description, category..."
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#687280] hidden sm:inline">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#111827] cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft Idea</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#111827] cursor-pointer"
                >
                  <option value="recent">Recently Updated</option>
                  <option value="name">Project Name (A-Z)</option>
                </select>
              </div>
            </div>
          )}

          {/* Project List */}
          {filteredProjects.length === 0 ? (
            projects.length === 0 ? (
              /* Onboarding Empty State */
              <div className="bg-white border-2 border-dashed border-[#D1D5DB] rounded-2xl p-10 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center mx-auto text-[#111827]">
                  <FolderGit2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#111827]">No projects planned yet</h3>
                  <p className="text-xs text-[#687280] leading-relaxed">
                    Start by describing your idea in natural language. A structured project blueprint will make future professional collaboration with freelancers and consultants much easier.
                  </p>
                </div>
                <Button
                  variant="accent"
                  size="md"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  onClick={onNewProject}
                  className="mx-auto"
                >
                  Start Your First Project
                </Button>
              </div>
            ) : (
              /* Search Filter Empty State */
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center space-y-3">
                <p className="text-xs text-[#687280]">
                  No projects match your current search and filter criteria.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-2xs hover:border-[#111827] transition-all hover:shadow-subtle flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#111827] group-hover:text-black">
                            {proj.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#687280] mt-1 line-clamp-2 leading-relaxed">
                          {proj.description || 'No description provided.'}
                        </p>
                      </div>
                      <Badge variant={stageVariant[proj.currentStage] || 'neutral'} size="sm">
                        {stageLabels[proj.currentStage] || proj.currentStage}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {proj.category || proj.summary?.projectType || 'Web App'}
                      </span>
                      <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {proj.summary?.estimatedTimeline || '3–6 months'}
                      </span>
                      <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded border border-[#E5E7EB]">
                        {proj.summary?.estimatedComplexity || 'Medium'} Complexity
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          proj.status === 'completed'
                            ? 'bg-[#DCFCE7] text-[#16A34A]'
                            : proj.status === 'in-progress'
                            ? 'bg-[#FEF3C7] text-[#D97706]'
                            : 'bg-[#F3F4F6] text-[#687280]'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F3F4F6] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {onEditProject && (
                        <button
                          onClick={() => onEditProject(proj)}
                          title="Edit Project Idea"
                          aria-label={`Edit ${proj.name}`}
                          className="p-1.5 text-[#687280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-md transition-subtle cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onDeleteProject && (
                        <button
                          onClick={() => onDeleteProject(proj)}
                          title="Delete Project Plan"
                          aria-label={`Delete ${proj.name}`}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-subtle cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContinueChat(proj)}
                        className="text-xs h-8"
                      >
                        AI Chat
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                        onClick={() => onSelectProject(proj.id)}
                        className="text-xs h-8 font-semibold"
                      >
                        View Plan
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compact Connect with Freelancers Card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#D1D5DB] transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#687280]">Partner Matching</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  COMING SOON
                </span>
              </div>
              <h3 className="text-base font-bold text-[#111827]">
                Connect with Verified Freelancers
              </h3>
              <p className="text-xs text-[#687280] mt-0.5">
                Once your project blueprint is finalized, hire skilled engineers matched to your specific technology stack.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateConnect}
            className="shrink-0"
          >
            Explore Freelancers
          </Button>
        </div>
      </div>
    </div>
  );
};
