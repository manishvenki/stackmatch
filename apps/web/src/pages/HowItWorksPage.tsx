import React from 'react';
import {
  UserPlus,
  MessageSquare,
  FileCheck2,
  Cpu,
  Layers,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Printer,
  Share2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export interface HowItWorksPageProps {
  onStartPlanning: () => void;
  onNavigateHome: () => void;
  onNavigateFeatures: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onStartPlanning,
  onNavigateHome,
  onNavigateFeatures,
}) => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Account & Calibrate Onboarding',
      desc: 'Sign up in seconds and complete a guided 8-step onboarding flow. StackMatch learns your technical background, target platform interests, and goals to personalize planning recommendations.',
      deliverable: 'Calibrated User Persona & MongoDB Account',
    },
    {
      number: '02',
      icon: MessageSquare,
      title: 'Describe Your Idea in Natural Words',
      desc: 'Open the AI Discussion Studio and talk about your product naturally. Google Gemini AI extracts problem statements, identifies missing assumptions, and structures target user personas without forcing technical jargon.',
      deliverable: 'Structured Product Definition & User Roles',
    },
    {
      number: '03',
      icon: FileCheck2,
      title: 'Scope Functional & Non-Functional Requirements',
      desc: 'Review and refine extracted specifications. Differentiate between day-one MVP essentials and future enhancements. Add custom user stories with measurable acceptance criteria.',
      deliverable: 'Prioritized Requirements Matrix',
    },
    {
      number: '04',
      icon: Cpu,
      title: 'Choose Your Technology Stack with Trade-Offs',
      desc: 'Receive tailored technology recommendations with suitability scores across frontend, backend, databases, and container infrastructure. Compare alternatives side-by-side to make confident decisions.',
      deliverable: 'Evaluated Tech Stack with Authentic Logos',
    },
    {
      number: '05',
      icon: Layers,
      title: 'Plan Multi-Tier Architecture & Sequential Roadmap',
      desc: 'Inspect the 3-tier system architecture topography and health validation findings. Review a structured 4-phase development roadmap with measurable deliverables and dependency sequencing.',
      deliverable: '3-Tier System Topology & 4-Phase Milestones',
    },
    {
      number: '06',
      icon: FileText,
      title: 'Generate, Print, Export & Share Your Blueprint',
      desc: 'Synthesize a complete 8-section dynamic engineering blueprint. Print clean PDFs with zero browser chrome, export raw Markdown/JSON specs, or share project summaries across LinkedIn, WhatsApp, and X.',
      deliverable: 'Production-Ready Engineering Blueprint',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 lg:py-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge variant="highlight">The StackMatch Methodology</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight">
            How StackMatch Works
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
            From raw concept to build-ready blueprint in six clear, data-driven steps.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#9CA3AF] transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-[#9CA3AF] font-mono leading-none">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center mt-3 shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 max-w-xl">
                    <h3 className="text-base sm:text-lg font-bold text-[#111827]">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                      {step.desc}
                    </p>
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-[#2563EB] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Deliverable: {step.deliverable}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-start md:self-center">
                  <span className="text-[11px] font-bold text-[#687280] bg-[#F3F4F6] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
                    Phase {idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Block */}
        <div className="bg-[#111827] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Start scoping your first project blueprint
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-lg mx-auto">
            Join founders, students, and engineers using StackMatch to plan smarter and build with confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="font-bold bg-white text-[#111827] hover:bg-[#F3F4F6] cursor-pointer"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={onStartPlanning}
            >
              Start Planning Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-[#374151] hover:bg-[#1F2937] cursor-pointer"
              onClick={onNavigateFeatures}
            >
              Explore All Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
