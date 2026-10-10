import React from 'react';
import {
  MessageSquare,
  FileText,
  Cpu,
  Layers,
  MapPin,
  FileCheck,
  Share2,
  Database,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export interface FeaturesPageProps {
  onStartPlanning: () => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onStartPlanning,
  onNavigateHome,
  onNavigateHowItWorks,
}) => {
  const liveFeatures = [
    {
      icon: MessageSquare,
      title: 'AI Discussion Studio',
      badge: 'Live Engine',
      description: 'Engage in natural-language architectural scoping powered by Google Gemini AI. The studio analyzes your problem statement, target users, and technical constraints, automatically extracting requirements.',
    },
    {
      icon: FileText,
      title: 'Requirements Planning Matrix',
      badge: 'Interactive',
      description: 'Categorize functional capabilities, non-functional latency/throughput constraints, and MVP boundary items with acceptance criteria and priority flags.',
    },
    {
      icon: Cpu,
      title: 'Technology Stack Recommendation',
      badge: 'Suitability Scoring',
      description: 'Receive evaluated frontend, backend, database, and infrastructure selections complete with adoption rationale, suitability scoring, and authentic vector brand logos.',
    },
    {
      icon: Layers,
      title: 'Technology Comparison Matrix',
      badge: 'Multi-Category',
      description: 'Compare candidate technologies across Databases, Frontend Frameworks, Backend Runtimes, and Deployment tiers with side-by-side trade-off evaluations.',
    },
    {
      icon: MapPin,
      title: '3-Tier System Architecture Topography',
      badge: 'Automated Topology',
      description: 'Visualize client presentation, API gateway services, data persistence, and security tiers with concrete component responsibilities and health verification findings.',
    },
    {
      icon: Zap,
      title: 'Development Roadmap & Milestones',
      badge: 'Sequential Phasing',
      description: 'A 4-phase sequential execution plan detailing foundation setup, core feature build, third-party integrations, and launch readiness with verifiable criteria.',
    },
    {
      icon: FileCheck,
      title: 'Engineering Blueprint Engine',
      badge: 'Dynamic Spec',
      description: 'Replace static templates with an 8-section, project-specific blueprint synthesizing all scoped requirements, vector logos, risk mitigations, and a 10-point readiness checklist.',
    },
    {
      icon: Share2,
      title: 'Vector Print Engine & Native Social Sharing',
      badge: 'Print & Export',
      description: 'Print directly to clean PDF documents with zero application chrome, or export to Markdown and JSON specification files. Share project summaries to LinkedIn, WhatsApp, and X.',
    },
    {
      icon: Database,
      title: 'MongoDB Cloud Persistence',
      badge: 'Persistent Storage',
      description: 'Every project idea, user onboarding preference, chat turn, and generated blueprint is safely isolated by user ID and persisted directly in MongoDB.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-16 space-y-16">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Badge variant="highlight">Platform Specifications</Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] tracking-tight">
            Comprehensive Capabilities for Build-Ready Software Planning
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
            StackMatch is designed to eliminate architectural guesswork. Explore the tools built directly into our planning platform.
          </p>
        </div>

        {/* Live Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#111827] text-white flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                      {feat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111827]">{feat.title}</h3>
                    <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#F3F4F6] mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#16A34A]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Production Capability</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Future Preview Block: Connect with Freelancers */}
        <div className="bg-white rounded-2xl border border-[#D1D5DB] p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111827]">
                  Next Evolution: Connect with Freelancers & Dev Teams
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  COMING SOON
                </span>
              </div>
              <p className="text-xs text-[#4B5563] mt-1 max-w-2xl leading-relaxed">
                Once your project blueprint is complete, StackMatch will connect you directly with pre-vetted freelance engineers and consultancies who can execute your verified technical specification.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="bg-[#111827] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to turn your idea into a production specification?
          </h2>
          <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto">
            Create your account today and experience AI-assisted architecture planning.
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
              onClick={onNavigateHowItWorks}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
