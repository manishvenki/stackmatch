import React, { useState } from 'react';
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
  Users,
  Clock,
  Database,
  Server,
  Download,
  Flame,
  CheckSquare,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { StackMatchLogo } from '../components/brand/StackMatchLogo';
import { TechLogo } from '../components/brand/techLogos';
import {
  DoodleUnderline,
  DoodleSpark,
  DoodleConnector,
  DoodleBadge,
  DoodleArchitecture,
} from '../components/doodles';

export interface LandingPageProps {
  onStartPlanning: () => void;
  onExploreProject: (projectId: string) => void;
  onExploreHowItWorks?: () => void;
  onExploreConnect?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onExploreProject,
  onExploreHowItWorks,
  onExploreConnect,
}) => {
  // Interactive Hero Preview Tab State
  const [heroActiveTab, setHeroActiveTab] = useState<'requirements' | 'stack' | 'architecture' | 'roadmap' | 'blueprint'>('stack');

  return (
    <div className="w-full bg-[#F9FAFB] text-[#111827] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle Architectural Grid Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#D1D5DB_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge with Doodle Spark */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-2xs hover:border-[#D1D5DB] transition-all max-w-[92vw]">
              <DoodleSpark size={16} color="#2563EB" className="shrink-0" />
              <span className="text-[11px] sm:text-xs font-semibold text-[#111827] truncate min-w-0">
                <span className="sm:hidden">StackMatch 2.0 • AI Product Planning Studio</span>
                <span className="hidden sm:inline">StackMatch 2.0 — AI Product Planning & Architecture Studio</span>
              </span>
            </div>

            {/* Main Headline with Hand-drawn Doodle Underline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#111827] tracking-tight leading-[1.18] pb-1">
              Turn your idea into a{' '}
              <span className="relative inline-block text-[#111827] pb-2 sm:pb-3">
                build-ready plan
                <span className="absolute bottom-0 left-0 right-0 w-full pointer-events-none">
                  <DoodleUnderline color="#2563EB" />
                </span>
              </span>
              .
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-2xl mx-auto font-normal">
              Define your requirements, discover the right technology stack, explore your architecture, and build a roadmap with AI-powered guidance.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartPlanning}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                Start Planning
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreHowItWorks || (() => onExploreProject('proj_college_food_01'))}
                className="w-full sm:w-auto text-sm font-semibold hover:bg-white transition-all"
              >
                Explore How It Works
              </Button>
            </div>

            {/* Hero Trust Micro-Indicators */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#687280]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Natural language AI scoping
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" /> Instant multi-page PDF blueprint
              </span>
            </div>
          </div>

          {/* Hero Master Workspace Composition (Interactive Product Preview) */}
          <div className="mt-14 max-w-5xl mx-auto relative">
            {/* Hand-drawn decorative pointer doodle (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 absolute -top-8 -right-8 z-20 text-xs font-bold text-[#2563EB] select-none">
              <span className="bg-white px-2.5 py-1 rounded-full border border-[#BFDBFE] shadow-2xs">
                Live Interactive Studio
              </span>
              <DoodleConnector type="curved-arrow" color="#2563EB" className="w-12 h-6 -rotate-12" />
            </div>

            <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-2xl overflow-hidden transition-all">
              {/* Studio Header Bar */}
              <div className="bg-[#FAFAFA] border-b border-[#E5E7EB] px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs">
                    <StackMatchLogo variant="mark" size="sm" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#111827]">College Food Ordering Platform</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                        Verified Scope
                      </span>
                    </div>
                    <span className="text-[11px] text-[#687280]">
                      Web & Mobile Application • Delivery Window: 3–6 months
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExploreProject('proj_college_food_01')}
                    rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
                    className="h-8 text-xs font-semibold"
                  >
                    Open Live Studio
                  </Button>
                </div>
              </div>

              {/* Studio Interactive Tab Bar */}
              <div className="bg-white border-b border-[#E5E7EB] px-4 sm:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'requirements', label: '1. Scoped Requirements', icon: <Layers className="w-3.5 h-3.5" /> },
                  { id: 'stack', label: '2. Tech Stack Scores', icon: <Cpu className="w-3.5 h-3.5" /> },
                  { id: 'architecture', label: '3. System Topography', icon: <Server className="w-3.5 h-3.5" /> },
                  { id: 'roadmap', label: '4. Delivery Roadmap', icon: <Clock className="w-3.5 h-3.5" /> },
                  { id: 'blueprint', label: '5. Executive Blueprint', icon: <FileText className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHeroActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                      heroActiveTab === tab.id
                        ? 'border-[#2563EB] text-[#2563EB]'
                        : 'border-transparent text-[#687280] hover:text-[#111827]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Interactive Preview Canvas */}
              <div className="p-6 sm:p-8 min-h-[290px] bg-white">
                {/* TAB 1: REQUIREMENTS */}
                {heroActiveTab === 'requirements' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                      <span className="text-xs font-bold text-[#111827]">
                        7 Scoped Agile Requirements & Acceptance Criteria
                      </span>
                      <span className="text-[11px] text-[#2563EB] font-semibold">100% Scoped via AI</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">1. Student Authentication & Campus SSO</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">High</span>
                        </div>
                        <p className="text-[#687280] text-[11px]">Role-based permissions for students, cafeteria staff, and campus administrators.</p>
                        <span className="text-[10px] text-[#16A34A] font-semibold block">✓ SSO token verified in &lt;200ms</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">2. Real-Time Menu & Stock Tracking</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">MVP</span>
                        </div>
                        <p className="text-[#687280] text-[11px]">Live stock count of meal items with allergens, preparation times, and instant cart sync.</p>
                        <span className="text-[10px] text-[#16A34A] font-semibold block">✓ Out-of-stock items disable cart adding immediately</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">3. QR Pick-up Slot Validation</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Medium</span>
                        </div>
                        <p className="text-[#687280] text-[11px]">Students receive encrypted QR code; vendor tablet terminal scans to confirm pickup.</p>
                        <span className="text-[10px] text-[#16A34A] font-semibold block">✓ Verified offline sync with tablet terminal</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">4. Sub-500ms Peak Concurrency</span>
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">Non-Func</span>
                        </div>
                        <p className="text-[#687280] text-[11px]">Handles 1,000 students placing simultaneous orders during 10-minute class breaks.</p>
                        <span className="text-[10px] text-[#16A34A] font-semibold block">✓ P99 latency &lt;450ms under synthetic load</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TECH STACK (DEFAULT) */}
                {heroActiveTab === 'stack' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-[#111827]">
                        Verified Technology Matches with Suitability Scores
                      </span>
                      <span className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Evaluated against project profile
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                        { name: 'React', cat: 'Frontend', score: 98, role: 'Student Ordering Portal' },
                        { name: 'Node.js', cat: 'Backend', score: 95, role: 'Order Dispatch Microservice' },
                        { name: 'MongoDB', cat: 'Database', score: 93, role: 'Document Menu & Cart Store' },
                        { name: 'Redis', cat: 'Cache', score: 91, role: 'High-Concurrency Queue' },
                        { name: 'Tailwind CSS', cat: 'Styling', score: 96, role: 'Responsive Mobile UI' },
                        { name: 'Docker', cat: 'Container', score: 92, role: 'Microservice Packaging' },
                      ].map((t, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#111827] hover:bg-white transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <TechLogo name={t.name} size={24} />
                              <span className="text-xs font-black text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                                {t.score}%
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-[#111827]">{t.name}</h5>
                            <span className="text-[10px] text-[#687280] font-medium block">{t.cat}</span>
                          </div>
                          <span className="text-[10px] text-[#4B5563] mt-2 block border-t border-[#E5E7EB] pt-1 truncate">
                            {t.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: ARCHITECTURE */}
                {heroActiveTab === 'architecture' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-[#111827]">
                        3-Tier Multi-Service Architectural Topography
                      </span>
                      <span className="text-[11px] text-[#2563EB] font-semibold">Zero Cyclic Dependencies</span>
                    </div>
                    <DoodleArchitecture />
                  </div>
                )}

                {/* TAB 4: ROADMAP */}
                {heroActiveTab === 'roadmap' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-[#111827]">
                        4-Phase Sequential Development Timeline
                      </span>
                      <span className="text-[11px] text-[#687280]">Total Duration: 16 Weeks</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">Phase 1 • Core MVP</span>
                          <span className="text-[10px] bg-white border border-[#D1D5DB] px-1.5 py-0.5 rounded font-semibold">Weeks 1–4</span>
                        </div>
                        <ul className="text-[11px] text-[#4B5563] space-y-1">
                          <li>• Student auth & campus email verification</li>
                          <li>• Food court menu catalogue & order cart</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">Phase 2 • Real-Time</span>
                          <span className="text-[10px] bg-white border border-[#D1D5DB] px-1.5 py-0.5 rounded font-semibold">Weeks 5–8</span>
                        </div>
                        <ul className="text-[11px] text-[#4B5563] space-y-1">
                          <li>• WebSocket order dispatch to vendor KDS</li>
                          <li>• Encrypted QR code pick-up validation</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">Phase 3 • Optimization</span>
                          <span className="text-[10px] bg-white border border-[#D1D5DB] px-1.5 py-0.5 rounded font-semibold">Weeks 9–12</span>
                        </div>
                        <ul className="text-[11px] text-[#4B5563] space-y-1">
                          <li>• Payment Gateway & meal card deduction</li>
                          <li>• Redis cache for peak lecture break traffic</li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#111827]">Phase 4 • Rollout</span>
                          <span className="text-[10px] bg-white border border-[#D1D5DB] px-1.5 py-0.5 rounded font-semibold">Weeks 13–16</span>
                        </div>
                        <ul className="text-[11px] text-[#4B5563] space-y-1">
                          <li>• Vendor settlement reports & payouts</li>
                          <li>• Multi-cafeteria campus launch pilot</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: BLUEPRINT */}
                {heroActiveTab === 'blueprint' && (
                  <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs animate-in fade-in duration-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#2563EB]" />
                        <h4 className="font-bold text-[#111827]">Complete Executive Blueprint Spec Ready</h4>
                      </div>
                      <p className="text-[#687280] text-[11px] max-w-xl">
                        Generated specification includes problem statement, 7 scoped requirements, technology trade-offs, architecture diagrams, delivery roadmap, risks, and checklist.
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onExploreProject('proj_college_food_01')}
                      leftIcon={<Download className="w-3.5 h-3.5 text-white" />}
                      className="shrink-0 text-xs font-bold"
                    >
                      Download Multi-Page PDF
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS — THE 5-STEP VISUAL METHODOLOGY */}
      <section className="py-20 bg-white border-y border-[#E5E7EB] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
              Clear & Intentional Process
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
              How StackMatch works
            </h2>
            <p className="text-sm text-[#687280] leading-relaxed">
              From an initial conversation to an engineering-ready blueprint with measurable certainty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              {
                step: '01',
                title: 'Describe your idea',
                desc: 'Type your concept in plain English. No technical terminology or prior architecture knowledge required.',
                tag: 'AI Scoping',
              },
              {
                step: '02',
                title: 'Refine requirements',
                desc: 'StackMatch structures your vision into functional user stories, role permissions, and MVP boundaries.',
                tag: 'Agile Specs',
              },
              {
                step: '03',
                title: 'Choose technology stack',
                desc: 'Review suitability scores comparing databases, runtimes, and frameworks with pros, cons, and license facts.',
                tag: 'Trade-off Matrix',
              },
              {
                step: '04',
                title: 'Explore architecture',
                desc: 'Inspect a clean 3-tier system topography connecting clients, gateways, microservices, and databases.',
                tag: 'Topography',
              },
              {
                step: '05',
                title: 'Generate blueprint',
                desc: 'Export a professional, multi-page PDF or Markdown blueprint ready to share with teams and freelancers.',
                tag: 'PDF Export',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] hover:border-[#111827] hover:bg-white transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors">
                    {item.step}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#111827]">{item.title}</h4>
                <p className="text-xs text-[#687280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE PRODUCT FEATURES */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
              Production Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
              Everything needed to plan with confidence
            </h2>
            <p className="text-sm text-[#687280] leading-relaxed">
              Purpose-built tools replacing scattered notes, subjective opinions, and expensive rewrite risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#111827] transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">AI Scoping & Requirements Engine</h4>
                <p className="text-xs text-[#687280] leading-relaxed mt-1.5">
                  Natural language conversation extracts clear functional specifications, acceptance criteria, and user roles without requiring technical knowledge.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] font-semibold text-[#2563EB]">
                Continuous Context Calibration →
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#111827] transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">Algorithmic Tech Suitability Scoring</h4>
                <p className="text-xs text-[#687280] leading-relaxed mt-1.5">
                  Objective match scores evaluated against your project complexity, budget profile, scalability goals, and team learning curves.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] font-semibold text-[#2563EB]">
                Objective Trade-off Matrices →
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#111827] transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Server className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">Tiered Architectural Topography</h4>
                <p className="text-xs text-[#687280] leading-relaxed mt-1.5">
                  Visual mapping of client layers, API gateways, persistence tiers, and caching nodes with automated circular-dependency checks.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] font-semibold text-[#2563EB]">
                Validated Architectural Consistency →
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#111827] transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">Sequential 4-Phase Roadmap</h4>
                <p className="text-xs text-[#687280] leading-relaxed mt-1.5">
                  Milestone-driven implementation schedule with time estimates, deliverable checklists, and critical dependency paths.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] font-semibold text-[#2563EB]">
                Realistic Delivery Windows →
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#111827] transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">Multi-Page Vector Blueprint Export</h4>
                <p className="text-xs text-[#687280] leading-relaxed mt-1.5">
                  One-click export of executive PDF specifications with real project logos, typography, page numbers, and selectable text.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] font-semibold text-[#2563EB]">
                A4 Vector Multi-Page PDF & Markdown →
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-[#111827] transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#111827]">StackMatch Connect Marketplace</h4>
                <p className="text-xs text-[#687280] leading-relaxed mt-1.5">
                  Share verified blueprints with pre-evaluated freelancers and engineering teams, eliminating misaligned estimates and scope surprises.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F3F4F6] text-[11px] font-semibold text-[#D97706]">
                Preview Marketplace →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO IT'S BUILT FOR */}
      <section className="py-20 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Designed for creators, teams, and builders
            </h2>
            <p className="text-sm text-[#687280]">
              Bridging the communication gap between business vision and engineering execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Audience 01</span>
              <h4 className="text-sm font-bold text-[#111827]">Non-Technical Creators</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Communicate ideas clearly to software agencies and freelancers without being misled by unnecessary technical complexity.
              </p>
            </div>
            <div className="p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Audience 02</span>
              <h4 className="text-sm font-bold text-[#111827]">Founders & Startups</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Structure scoping briefs, establish MVP boundaries, and establish realistic delivery budgets and milestones before hiring.
              </p>
            </div>
            <div className="p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Audience 03</span>
              <h4 className="text-sm font-bold text-[#111827]">Students & Builders</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Understand how modern full-stack systems fit together and learn why specific databases or architectures are chosen.
              </p>
            </div>
            <div className="p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] shadow-2xs space-y-2">
              <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block">Audience 04</span>
              <h4 className="text-sm font-bold text-[#111827]">Engineers & Consultants</h4>
              <p className="text-xs text-[#687280] leading-relaxed">
                Speed up technical discovery, trade-off matrix documentation, and RFC proposals for clients and team reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL HIGH-IMPACT CALL TO ACTION */}
      <section className="py-20 bg-[#F9FAFB] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5E7EB] text-xs font-semibold text-[#111827] shadow-2xs">
            <DoodleSpark size={14} color="#2563EB" />
            <span>Ready to build your next breakthrough product?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
            Plan smarter. Choose better.{' '}
            <span className="text-[#2563EB]">Build with confidence.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#4B5563] max-w-xl mx-auto leading-relaxed">
            Stop guessing your architecture and requirements. Start your guided AI scoping session and generate your blueprint in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartPlanning}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Start Planning Now
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onExploreHowItWorks || (() => onExploreProject('proj_college_food_01'))}
              className="w-full sm:w-auto text-sm font-semibold hover:bg-white transition-all"
            >
              Explore Sample Blueprint
            </Button>
          </div>
        </div>
      </section>

      {/* 6. CLEAN FOOTER */}
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
