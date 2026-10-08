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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreProject: (projectId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreProject,
}) => {
  return (
    <div className="w-full bg-[#F9FAFB]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
              <span className="text-xs font-semibold text-[#111827]">
                StackMatch 1.0 — Architecture & Planning Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1]">
              Turn your idea into a <span className="underline decoration-[#111827] decoration-2 underline-offset-8">build-ready blueprint</span>.
            </h1>

            <p className="text-base sm:text-lg text-[#687280] leading-relaxed max-w-2xl mx-auto">
              Discuss your idea, understand the requirements, choose the right technology, and create a clear project plan — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartPlanning}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto text-sm font-semibold"
              >
                Start Planning Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => onExploreProject('proj_college_food_01')}
                className="w-full sm:w-auto text-sm font-semibold"
              >
                See Example Projects
              </Button>
            </div>

            {/* Product Trust Indicators */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
              <div className="p-3 bg-white/70 rounded-lg border border-[#E5E7EB]">
                <p className="text-lg font-bold text-[#111827]">500+</p>
                <p className="text-xs text-[#687280]">Projects Planned</p>
              </div>
              <div className="p-3 bg-white/70 rounded-lg border border-[#E5E7EB]">
                <p className="text-lg font-bold text-[#111827]">20+</p>
                <p className="text-xs text-[#687280]">Technologies Covered</p>
              </div>
              <div className="p-3 bg-white/70 rounded-lg border border-[#E5E7EB]">
                <p className="text-lg font-bold text-[#111827]">Detailed</p>
                <p className="text-xs text-[#687280]">Side-by-Side Trade-offs</p>
              </div>
              <div className="p-3 bg-white/70 rounded-lg border border-[#E5E7EB]">
                <p className="text-lg font-bold text-[#111827]">Production</p>
                <p className="text-xs text-[#687280]">Ready Architecture</p>
              </div>
            </div>
          </div>

          {/* Hero Supporting Visual: Interactive Workspace Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="highlight" size="sm">Active Plan</Badge>
                    <span className="text-xs text-[#687280]">Stage 3: Planning</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111827]">
                    College Food Ordering Platform
                  </h3>
                  <p className="text-xs text-[#687280] mt-0.5">
                    Web + Mobile Application for Campus Dining & Merchant Hubs
                  </p>
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

              {/* Recommended Stack Preview Strip */}
              <div className="py-6">
                <span className="text-xs font-semibold text-[#687280] uppercase tracking-wider block mb-3">
                  Recommended Technology Stack Preview
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-medium">Frontend</span>
                    <h5 className="text-sm font-bold text-[#111827]">React</h5>
                    <span className="text-[11px] font-semibold text-[#16A34A] block mt-1">94% Match</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-medium">Backend</span>
                    <h5 className="text-sm font-bold text-[#111827]">Node.js</h5>
                    <span className="text-[11px] font-semibold text-[#16A34A] block mt-1">92% Match</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-medium">Database</span>
                    <h5 className="text-sm font-bold text-[#111827]">PostgreSQL</h5>
                    <span className="text-[11px] font-semibold text-[#16A34A] block mt-1">94% Match</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-medium">Payments</span>
                    <h5 className="text-sm font-bold text-[#111827]">Razorpay</h5>
                    <span className="text-[11px] font-semibold text-[#16A34A] block mt-1">90% Match</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] transition-subtle">
                    <span className="text-[10px] text-[#687280] block font-medium">Deployment</span>
                    <h5 className="text-sm font-bold text-[#111827]">Docker</h5>
                    <span className="text-[11px] font-semibold text-[#16A34A] block mt-1">90% Match</span>
                  </div>
                </div>
              </div>

              {/* Quick Deliverables Snapshot */}
              <div className="pt-4 border-t border-[#E5E7EB] flex flex-wrap items-center justify-between text-xs text-[#374151] gap-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> 8 Project Requirements
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Architecture Diagram Ready
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> 4-Phase Delivery Timeline
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#16A34A]" /> Complete PDF Blueprint Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Workflow: The StackMatch Journey */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              A structured path from napkin sketch to technical blueprint
            </h2>
            <p className="text-sm text-[#687280] mt-3 leading-relaxed">
              StackMatch replaces vague prompts with a clear engineering methodology built for developers, founders, and students alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">
                Explain in Simple Words
              </h3>
              <p className="text-xs text-[#687280] leading-relaxed">
                Describe what you want to achieve without worrying about database normalization, cache layers, or serverless vs monolith debates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">
                Automated Requirement Breakdown
              </h3>
              <p className="text-xs text-[#687280] leading-relaxed">
                Instantly generates categorized functional and non-functional requirements, prioritized by business value and delivery complexity.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">
                Architectural Blueprint
              </h3>
              <p className="text-xs text-[#687280] leading-relaxed">
                Receive recommended technologies with side-by-side trade-offs, system architecture diagrams, and a sequential development roadmap.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Designed for every stage of technical fluency
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB]">
              <h4 className="text-sm font-bold text-[#111827] mb-1">Non-Technical Creators</h4>
              <p className="text-xs text-[#687280]">Communicate ideas clearly to software agencies without being misled.</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB]">
              <h4 className="text-sm font-bold text-[#111827] mb-1">Founders & Clients</h4>
              <p className="text-xs text-[#687280]">Structure scoping documents and establish clear delivery milestones.</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB]">
              <h4 className="text-sm font-bold text-[#111827] mb-1">Students & Beginners</h4>
              <p className="text-xs text-[#687280]">Understand how modern web, mobile, and backend systems fit together.</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-[#E5E7EB]">
              <h4 className="text-sm font-bold text-[#111827] mb-1">Experienced Engineers</h4>
              <p className="text-xs text-[#687280]">Speed up technical discovery, trade-off evaluations, and architecture RFCs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-[#111827] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to plan your next product?
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto">
            Experience the clarity of structured product planning. No credit card required.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={onStartPlanning}
              className="text-[#111827] font-semibold"
            >
              Start Free Project
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
