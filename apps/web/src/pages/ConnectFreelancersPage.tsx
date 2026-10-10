import React from 'react';
import {
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
  Search,
  ShieldCheck,
  FileSpreadsheet,
  Layers,
  ArrowLeft,
  Compass,
  Code,
  Server,
  Palette,
  Clock,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Project } from '../types';

export interface ConnectFreelancersPageProps {
  activeProject?: Project;
  onNavigateToDashboard: () => void;
  onNavigateToProject?: () => void;
  onNavigateToChat?: () => void;
}

export const ConnectFreelancersPage: React.FC<ConnectFreelancersPageProps> = ({
  activeProject,
  onNavigateToDashboard,
  onNavigateToProject,
  onNavigateToChat,
}) => {
  return (
    <div className="flex-1 bg-[#F9FAFB] overflow-y-auto p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToDashboard}
              className="p-1.5 rounded-lg border border-[#D1D5DB] bg-white text-[#687280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-subtle cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-[#687280]">StackMatch Marketplace</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  COMING SOON
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                Connect with Freelancers
              </h1>
              <p className="text-xs sm:text-sm text-[#687280] mt-0.5">
                From a clear project blueprint to the right technical partner.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToDashboard}
            >
              Back to Dashboard
            </Button>
            {activeProject && onNavigateToProject && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigateToProject}
                leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
              >
                View Active Plan
              </Button>
            )}
          </div>
        </div>

        {/* Main Hero Promotional Panel */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-10 shadow-subtle relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-semibold text-[#2563EB]">
                <Users className="w-3.5 h-3.5" />
                <span>Planned Capability • StackMatch Connect</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight leading-tight">
                Your idea deserves the right team.
              </h2>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                StackMatch is building a simpler way to connect your project plan with skilled freelancers, IT consultants, and development teams. Turn your blueprint into a clearer starting point for collaboration.
              </p>

              <p className="text-xs text-[#687280] leading-relaxed">
                Your project plan is the first step. Find the right people to help bring your idea to life without ambiguous requirements, misaligned expectations, or guesswork.
              </p>

              {/* Status Element - Non-interactive, clear status pill */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#F3F4F6] border border-[#D1D5DB] text-xs font-semibold text-[#4B5563] shadow-2xs select-none">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                  <span>Freelancer marketplace — Coming Soon</span>
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1.5 ml-1">
                  Discovery, proposals, and verified matching are currently in development.
                </p>
              </div>
            </div>

            {/* Restrained Visual Composed from UI Primitives & Icons */}
            <div className="lg:col-span-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2.5">
                <span className="text-[11px] font-bold text-[#687280] uppercase tracking-wider">
                  Future Collaboration Roster
                </span>
                <span className="text-[10px] font-semibold text-[#9CA3AF]">Preview Model</span>
              </div>

              {/* Specialist Categories Preview */}
              <div className="space-y-2">
                {[
                  {
                    icon: Code,
                    role: 'Full-Stack Developers',
                    desc: 'React, Node.js, TypeScript implementation',
                  },
                  {
                    icon: Palette,
                    role: 'UI/UX Product Designers',
                    desc: 'Design systems, prototyping & responsive flows',
                  },
                  {
                    icon: Server,
                    role: 'Cloud & DevOps Specialists',
                    desc: 'Docker containers, database setup & CI/CD',
                  },
                  {
                    icon: Compass,
                    role: 'IT Consultants & Tech Leads',
                    desc: 'Architecture audits & engineering milestones',
                  },
                ].map((spec, i) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] text-[#111827] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#111827] truncate">{spec.role}</h4>
                        <p className="text-[10px] text-[#687280] truncate">{spec.desc}</p>
                      </div>
                      <span className="text-[9px] font-semibold text-[#9CA3AF] bg-[#F9FAFB] px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                        Phase 4
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Philosophical Quote */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-2xs space-y-3">
          <div className="w-8 h-0.5 bg-[#D1D5DB] mx-auto mb-2" />
          <blockquote className="text-base sm:text-lg font-medium text-[#111827] italic tracking-tight">
            “Great products start with clear ideas and grow with the right people.”
          </blockquote>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#687280]">
            — The StackMatch philosophy
          </p>
          <div className="w-8 h-0.5 bg-[#D1D5DB] mx-auto mt-2" />
        </div>

        {/* Three Polished Feature Preview Cards */}
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Planned Marketplace Capabilities</h3>
            <p className="text-xs text-[#687280]">How StackMatch Connect will bridge blueprint planning and actual engineering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 */}
            <Card className="flex flex-col justify-between space-y-4 bg-white border-[#E5E7EB] shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    Planned Capability
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">Find the Right Skills</h4>
                  <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
                    Discover professionals based on the technologies and capabilities your project needs.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Targeted skill matching
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="flex flex-col justify-between space-y-4 bg-white border-[#E5E7EB] shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    Planned Capability
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">Share Your Blueprint</h4>
                  <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
                    Give potential collaborators a structured overview of your goals, requirements, and planned technology stack.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Structured specification export
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="flex flex-col justify-between space-y-4 bg-white border-[#E5E7EB] shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] text-[#111827] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    Planned Capability
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">Work with Confidence</h4>
                  <p className="text-xs text-[#687280] mt-1.5 leading-relaxed">
                    Review portfolios, compare relevant experience, and prepare for more informed project discussions.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] text-[#9CA3AF] flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Informed kickoff & alignment
              </div>
            </Card>
          </div>
        </div>

        {/* Future Workflow Section */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
              End-to-End Collaboration Journey
            </span>
            <h3 className="text-lg font-bold text-[#111827] mt-0.5">
              How StackMatch Connect Will Work
            </h3>
            <p className="text-xs text-[#687280] mt-1">
              A transparent, 4-stage path from your idea to successful delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Plan your project.',
                desc: 'Use StackMatch AI to define requirements, evaluate technologies, and organize architecture.',
                status: 'Available Now',
                statusVariant: 'success',
              },
              {
                step: '02',
                title: 'Share your blueprint.',
                desc: 'Export or share a structured project plan with clear functional priorities and user stories.',
                status: 'Blueprint Ready',
                statusVariant: 'success',
              },
              {
                step: '03',
                title: 'Discover relevant professionals.',
                desc: 'Review vetted freelancers and agencies whose capabilities match your exact tech stack.',
                status: 'Coming Soon',
                statusVariant: 'neutral',
              },
              {
                step: '04',
                title: 'Discuss scope and next steps.',
                desc: 'Conduct kickoff discussions grounded in unambiguous specifications and milestone timelines.',
                status: 'Coming Soon',
                statusVariant: 'neutral',
              },
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#9CA3AF]">{st.step}</span>
                    <Badge variant={st.statusVariant as any} size="sm">
                      {st.status}
                    </Badge>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#111827]">{st.title}</h4>
                  <p className="text-xs text-[#687280] mt-1 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#4B5563] flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <p>
              The final discovery and kickoff steps will become available when StackMatch Connect launches in Phase 4. In the meantime, you can generate and refine your full project blueprint today.
            </p>
          </div>
        </div>

        {/* Active Project Context Card */}
        {activeProject && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#687280] uppercase tracking-wider block">
                Your Current Blueprint
              </span>
              <h4 className="text-base font-bold text-[#111827]">{activeProject.name}</h4>
              <p className="text-xs text-[#687280] max-w-xl">
                When StackMatch Connect launches, you will be able to share {activeProject.name}'s verified requirements and tech stack directly with candidate specialists.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {onNavigateToChat && (
                <Button variant="ghost" size="sm" onClick={onNavigateToChat}>
                  AI Scoping Studio
                </Button>
              )}
              {onNavigateToProject && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onNavigateToProject}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Blueprint
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectFreelancersPage;
