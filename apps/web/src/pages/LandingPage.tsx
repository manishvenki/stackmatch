import React from 'react';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  FileText,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Code2,
  GitBranch,
  Terminal,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { StackMatchLogo } from '../components/brand/StackMatchLogo';

export interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreProject: (projectId: string) => void;
  onExploreHowItWorks?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreProject,
  onExploreHowItWorks,
}) => {
  return (
    <div className="w-full bg-[#F9FAFB] text-[#111827]">
      {/* Hero Section */}
      <section className="relative pt-14 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#D1D5DB_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-xs font-semibold text-[#111827]">
                StackMatch 2.0 — AI Planning Intelligence & Architecture Studio
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.08]">
              Turn your product idea into a{' '}
              <span className="relative inline-block text-[#111827] decoration-[#2563EB] underline underline-offset-8 decoration-2">
                build-ready blueprint
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mx-auto font-normal">
              Discuss your idea in simple words, extract structured requirements, evaluate technology options with side-by-side trade-offs, and generate a clear engineering roadmap.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartPlanning}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto text-sm font-bold shadow-sm"
              >
                Start Planning
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreHowItWorks || (() => onExploreProject('proj_college_food_01'))}
                className="w-full sm:w-auto text-sm font-semibold"
              >
                Explore How It Works
              </Button>
            </div>

            {/* Product Indicators */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-left max-w-3xl mx-auto">
              <div className="p-3.5 bg-white/90 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <p className="text-base font-bold text-[#111827]">AI Scoping</p>
                <p className="text-xs text-[#687280] mt-0.5">Natural language to specs</p>
              </div>
              <div className="p-3.5 bg-white/90 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <p className="text-base font-bold text-[#111827]">Suitability Scoring</p>
                <p className="text-xs text-[#687280] mt-0.5">Tailored tech evaluations</p>
              </div>
              <div className="p-3.5 bg-white/90 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <p className="text-base font-bold text-[#111827]">Tiered Topography</p>
                <p className="text-xs text-[#687280] mt-0.5">3-tier architecture graphs</p>
              </div>
              <div className="p-3.5 bg-white/90 rounded-xl border border-[#E5E7EB] shadow-2xs">
                <p className="text-base font-bold text-[#111827]">Delivery Roadmap</p>
                <p className="text-xs text-[#687280] mt-0.5">Sequential MVP milestones</p>
              </div>
            </div>
          </div>

          {/* Hero Supporting Visual: Refined Live Workspace Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3.5">
                  <StackMatchLogo variant="mark" size="md" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="highlight" size="sm">Active Planning Studio</Badge>
                      <span className="text-xs text-[#687280] font-medium">Stage 3: Planning</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#111827]">
                      College Food Ordering Platform
                    </h3>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExploreProject('proj_college_food_01')}
                  rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                >
                  Open Live Workspace
                </Button>
              </div>

              {/* Recommended Stack Preview */}
              <div className="py-6">
                <span className="text-[11px] font-bold text-[#687280] uppercase tracking-wider block mb-3">
                  StackMatch Suitability Assessments (Verified Stack)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-semibold uppercase">Frontend</span>
                    <h5 className="text-sm font-bold text-[#111827]">React</h5>
                    <span className="text-xs font-semibold text-[#16A34A] block mt-1">94% Suitability</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-semibold uppercase">Backend</span>
                    <h5 className="text-sm font-bold text-[#111827]">Node.js</h5>
                    <span className="text-xs font-semibold text-[#16A34A] block mt-1">92% Suitability</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-semibold uppercase">Database</span>
                    <h5 className="text-sm font-bold text-[#111827]">PostgreSQL</h5>
                    <span className="text-xs font-semibold text-[#16A34A] block mt-1">95% Suitability</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-semibold uppercase">Payments</span>
                    <h5 className="text-sm font-bold text-[#111827]">Razorpay</h5>
                    <span className="text-xs font-semibold text-[#16A34A] block mt-1">91% Suitability</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-semibold uppercase">Deployment</span>
                    <h5 className="text-sm font-bold text-[#111827]">Docker</h5>
                    <span className="text-xs font-semibold text-[#16A34A] block mt-1">90% Suitability</span>
                  </div>
                </div>
              </div>

              {/* Planning Deliverables Snapshot */}
              <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-[#374151] gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> 8 Functional & Non-Functional Requirements
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Layered Architecture Topography Ready
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> 4-Phase Delivery Roadmap
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Pre-Flight Blueprint Spec
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 8-Step StackMatch Product Journey */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
              End-to-End Planning Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              From natural language idea to build-ready blueprint
            </h2>
            <p className="text-sm text-[#687280] mt-2.5 leading-relaxed">
              Every phase moves you closer to engineering certainty without getting bogged down in arbitrary terminology.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Idea', desc: 'Describe your concept naturally without technical jargon.' },
              { step: '02', title: 'AI Discussion', desc: 'Minimal focused follow-ups clarify scope & platforms.' },
              { step: '03', title: 'Requirements', desc: 'Structured functional, non-functional, and role journeys.' },
              { step: '04', title: 'Features', desc: 'Feature groups clearly demarcating MVP vs future milestones.' },
              { step: '05', title: 'Tech Stack', desc: 'Suitability scores with benefits, trade-offs, and alternatives.' },
              { step: '06', title: 'Architecture', desc: 'Layered visual topography connecting clients, APIs, and data.' },
              { step: '07', title: 'Roadmap', desc: '4-phase sequential delivery timeline with dependencies.' },
              { step: '08', title: 'Blueprint', desc: 'A complete executive proposal ready for development teams.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4.5 hover:border-[#111827] hover:bg-white transition-subtle group"
              >
                <span className="text-xs font-black text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors block mb-1">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-[#111827] mb-1">{item.title}</h4>
                <p className="text-xs text-[#687280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Built for founders, teams, and builders
            </h2>
            <p className="text-sm text-[#687280] mt-2">
              Bridges the communication gap between business vision and software implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs">
              <h4 className="text-sm font-bold text-[#111827] mb-1.5">Non-Technical Creators</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Communicate ideas clearly to software agencies and freelancers without being misled by unnecessary complexity.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs">
              <h4 className="text-sm font-bold text-[#111827] mb-1.5">Founders & Clients</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Structure scoping briefs, establish MVP boundaries, and establish realistic delivery budgets and milestones.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs">
              <h4 className="text-sm font-bold text-[#111827] mb-1.5">Students & Beginners</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Understand how modern full-stack systems fit together and learn why specific databases or architectures are chosen.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs">
              <h4 className="text-sm font-bold text-[#111827] mb-1.5">Experienced Engineers</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Speed up technical discovery, trade-off matrix documentation, and RFC proposals for clients and team reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E7EB] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <StackMatchLogo variant="full" size="sm" />
          </div>
          <p className="text-xs text-[#687280] text-center sm:text-right">
            Plan smarter. Choose better. Build with confidence. © {new Date().getFullYear()} StackMatch.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
