import React from 'react';
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
  Compass,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StackMatchLogo } from '../components/brand/StackMatchLogo';
import { Project, User } from '../types';

export interface DashboardPageProps {
  currentUser: User | null;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onContinueChat: (project: Project) => void;
  onNavigateConnect?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  projects,
  onSelectProject,
  onNewProject,
  onContinueChat,
  onNavigateConnect,
}) => {
  const stageVariant = {
    idea: 'neutral',
    requirements: 'highlight',
    planning: 'warning',
    finalize: 'success',
  } as const;

  const stageLabels = {
    idea: 'Idea & Discussion',
    requirements: 'Requirements Scoping',
    planning: 'Architecture & Tech Stack',
    finalize: 'Complete Blueprint Ready',
  };

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

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Your Planned Projects</h2>
              <p className="text-xs text-[#687280]">Recent scoping sessions and generated architecture</p>
            </div>
            {projects.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onNewProject}>
                + Create Project
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            /* Helpful Onboarding Empty State */
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-2xs hover:border-[#111827] transition-all hover:shadow-subtle flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-[#111827] group-hover:text-black">
                          {proj.name}
                        </h3>
                        <p className="text-xs text-[#687280] mt-0.5 line-clamp-2">
                          {proj.description}
                        </p>
                      </div>
                      <Badge variant={stageVariant[proj.currentStage] || 'neutral'} size="sm">
                        {stageLabels[proj.currentStage] || proj.currentStage}
                      </Badge>
                    </div>

                    {proj.summary && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded border border-[#E5E7EB]">
                          {proj.summary.projectType}
                        </span>
                        <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded border border-[#E5E7EB]">
                          {proj.summary.estimatedTimeline}
                        </span>
                        <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded border border-[#E5E7EB]">
                          {proj.summary.estimatedComplexity} Complexity
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                    <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Updated {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onContinueChat(proj)}
                        className="text-xs"
                      >
                        AI Chat
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                        onClick={() => onSelectProject(proj.id)}
                        className="text-xs"
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

        {/* Compact Connect with Freelancers Card (Prompt Section 6) */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-[#D1D5DB] transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                  Connect with Freelancers
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  COMING SOON
                </span>
              </div>
              <p className="text-xs text-[#4B5563] max-w-2xl leading-relaxed">
                Your project plan is the first step. Find the right people to help bring your idea to life. Connect your verified requirements with skilled freelancers, IT consultants, and development teams.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {onNavigateConnect && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateConnect}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Marketplace Preview
              </Button>
            )}
          </div>
        </div>

        {/* Product Journey Overview Banner */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StackMatchLogo variant="mark" size="sm" />
              <h3 className="text-sm font-bold text-[#111827]">StackMatch 8-Step Product Journey</h3>
            </div>
            <span className="text-[11px] text-[#687280]">
              Next Phase: <strong className="text-[#111827]">Connect with Freelancers</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 text-center text-xs">
            {[
              { step: '01', name: 'Idea' },
              { step: '02', name: 'Discussion' },
              { step: '03', name: 'Requirements' },
              { step: '04', name: 'Features' },
              { step: '05', name: 'Technology' },
              { step: '06', name: 'Architecture' },
              { step: '07', name: 'Roadmap' },
              { step: '08', name: 'Blueprint' },
            ].map((st, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="text-[10px] font-mono text-[#687280] block">{st.step}</span>
                <span className="font-bold text-[#111827] text-xs">{st.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
