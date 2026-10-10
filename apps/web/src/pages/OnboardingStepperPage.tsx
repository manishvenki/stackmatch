import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Check,
  User,
  GraduationCap,
  Code2,
  Rocket,
  Briefcase,
  Layers,
  Wrench,
  Cpu,
  Target,
  Clock,
  Edit2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { User as UserType, UserOnboardingData } from '../types';
import { api } from '../services/api';

export interface OnboardingStepperPageProps {
  currentUser: UserType | null;
  onComplete: (updatedUser: UserType) => void;
  onSkip?: () => void;
}

export const OnboardingStepperPage: React.FC<OnboardingStepperPageProps> = ({
  currentUser,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stepper answers state
  const [roles, setRoles] = useState<string[]>([]);
  const [technicalBackground, setTechnicalBackground] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [projectInterests, setProjectInterests] = useState<string[]>([]);
  const [customProjectInterest, setCustomProjectInterest] = useState<string>('');
  const [familiarTechnologies, setFamiliarTechnologies] = useState<string[]>([]);
  const [customTechnologies, setCustomTechnologies] = useState<string>('');
  const [goals, setGoals] = useState<string[]>([]);
  const [isCompletedSuccess, setIsCompletedSuccess] = useState(false);

  // Toggle helper for multi-select
  const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 2 && roles.length === 0) {
      setError('Please select at least one role describing who you are.');
      return;
    }
    if (currentStep === 3 && !technicalBackground) {
      setError('Please select your technical background.');
      return;
    }
    if (currentStep === 4 && !experienceLevel) {
      setError('Please select your experience level.');
      return;
    }
    if (currentStep === 5 && projectInterests.length === 0 && !customProjectInterest.trim()) {
      setError('Please select what type of software you want to build.');
      return;
    }
    if (currentStep === 7 && goals.length === 0) {
      setError('Please select at least one primary goal.');
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    setError(null);

    const onboardingPayload: UserOnboardingData = {
      roles: roles.length > 0 ? roles : ['Founder or entrepreneur'],
      technicalBackground: technicalBackground || 'General',
      experienceLevel: experienceLevel || 'Learning fundamentals',
      projectInterests: customProjectInterest.trim()
        ? [...projectInterests, customProjectInterest.trim()]
        : projectInterests,
      customProjectInterest: customProjectInterest.trim() || undefined,
      familiarTechnologies,
      customTechnologies: customTechnologies.trim() || undefined,
      goals: goals.length > 0 ? goals : ['Build project'],
      completedAt: new Date().toISOString()
    };

    try {
      const updatedUser = await api.saveOnboarding(onboardingPayload);
      setIsCompletedSuccess(true);
      setTimeout(() => {
        onComplete(updatedUser);
      }, 1200);
    } catch (err: any) {
      // Local fallback for offline mode
      const updated: UserType = {
        id: currentUser?.id || `usr_${Date.now()}`,
        name: currentUser?.name || 'Builder',
        email: currentUser?.email || 'user@stackmatch.dev',
        role: currentUser?.role || 'builder',
        createdAt: currentUser?.createdAt || new Date().toISOString(),
        ...currentUser,
        onboardingCompleted: true,
        onboardingResponses: onboardingPayload,
      };
      setIsCompletedSuccess(true);
      setTimeout(() => {
        onComplete(updated);
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-between text-[#111827]">
      {/* Top Header & Progress */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-xs">
              SM
            </div>
            <div>
              <span className="text-xs font-bold text-[#111827] block">StackMatch Onboarding</span>
              <span className="text-[10px] text-[#687280] block">Personalized Planning Setup</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#4B5563]">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="w-32 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
              <div
                className="h-full bg-[#111827] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Stepper Card Body */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-lg max-w-2xl w-full p-6 sm:p-10 space-y-8 animate-in fade-in duration-200">
          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#DC2626] font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: Welcome */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  Welcome to StackMatch{currentUser?.name ? `, ${currentUser.name}` : ''}!
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Let's build something meaningful.
                </h2>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  StackMatch is your AI-assisted planning studio. In the next few steps, we'll calibrate your planning intelligence so our recommendations match your goals, technical background, and project aspirations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                {[
                  { title: 'Idea Clarification', desc: 'Describe in natural words' },
                  { title: 'Technology Matching', desc: 'Realistic stack trade-offs' },
                  { title: 'Build-Ready Blueprint', desc: 'Printable engineering spec' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-xs font-bold text-[#111827] block">{item.title}</span>
                    <span className="text-[11px] text-[#687280] mt-0.5 block">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Who are you? */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#687280] uppercase tracking-wider block">
                  Step 2 • Persona
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">Who are you?</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Select all options that apply to how you work.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Student', desc: 'Learning, academic thesis, or college capstone' },
                  { label: 'Working professional', desc: 'Building on the side or exploring new tools' },
                  { label: 'Developer', desc: 'Hands-on engineer designing modern software' },
                  { label: 'Founder or entrepreneur', desc: 'Launching a commercial startup or SaaS' },
                  { label: 'Freelancer or consultant', desc: 'Scoping client projects with accuracy' },
                  { label: 'Other', desc: 'Product manager, hobbyist, or creator' },
                ].map((item) => {
                  const isSelected = roles.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => toggleSelection(roles, setRoles, item.label)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111827] bg-[#111827] text-white shadow-xs'
                          : 'border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <p className={`text-xs mt-1 ${isSelected ? 'text-[#D1D5DB]' : 'text-[#687280]'}`}>
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Technical background */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#687280] uppercase tracking-wider block">
                  Step 3 • Background
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">What is your technical familiarity?</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Helps our AI adjust the depth and vocabulary of technical explanations.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  'IT / Computer Science',
                  'Engineering or another technical background',
                  'Non-IT background (business, design, healthcare, etc.)',
                  'Beginner learning technology for the first time',
                  'Other background',
                ].map((item) => {
                  const isSelected = technicalBackground === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTechnicalBackground(item)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111827] bg-[#111827] text-white font-semibold'
                          : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <span className="text-sm">{item}</span>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Experience level */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#687280] uppercase tracking-wider block">
                  Step 4 • Depth
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">What is your experience level?</h2>
                <p className="text-xs text-[#687280] mt-1">
                  We'll suggest appropriate architectures and battle-tested patterns.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Complete beginner', desc: 'No prior coding experience — need plain-English clarity' },
                  { label: 'Learning fundamentals', desc: 'Familiar with HTML/CSS or basic scripts' },
                  { label: 'Have built a few projects', desc: 'Shipped websites or tutorials; ready for full-stack' },
                  { label: 'Experienced developer', desc: 'Comfortable with databases, APIs, and deployments' },
                  { label: 'Professional team', desc: 'Designing production-grade distributed architectures' },
                ].map((item) => {
                  const isSelected = experienceLevel === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setExperienceLevel(item.label)}
                      className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111827] bg-[#111827] text-white shadow-xs'
                          : 'border-[#E5E7EB] bg-white text-[#111827] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-[#D1D5DB]' : 'text-[#687280]'}`}>
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: What do you want to build? */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#687280] uppercase tracking-wider block">
                  Step 5 • Project Types
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">What do you want to build?</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Choose one or more categories, or write your own.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Web application',
                  'Mobile application',
                  'AI-powered product',
                  'SaaS platform',
                  'Developer tool',
                  'Business platform',
                  'Academic project',
                  'E-commerce store',
                ].map((item) => {
                  const isSelected = projectInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSelection(projectInterests, setProjectInterests, item)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111827] border-[#111827] text-white'
                          : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Custom or specific idea type:
                </label>
                <input
                  type="text"
                  value={customProjectInterest}
                  onChange={(e) => setCustomProjectInterest(e.target.value)}
                  placeholder="e.g. IoT agricultural sensor hub, campus barter portal"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] text-xs text-[#111827] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Technology familiarity */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#687280] uppercase tracking-wider block">
                  Step 6 • Tech Preferences
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">Technologies you know or want to learn</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Optional chips — we won't restrict your choices, but we will tailor explanations.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  'React',
                  'Node.js',
                  'TypeScript',
                  'Python',
                  'PostgreSQL',
                  'MongoDB',
                  'Docker',
                  'Express',
                  'Go',
                  'Redis',
                  'Tailwind CSS',
                  'Next.js',
                  'FastAPI',
                  'AWS',
                ].map((tech) => {
                  const isSelected = familiarTechnologies.includes(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleSelection(familiarTechnologies, setFamiliarTechnologies, tech)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#111827] border-[#111827] text-white shadow-2xs'
                          : 'bg-white border-[#D1D5DB] text-[#374151] hover:border-[#9CA3AF]'
                      }`}
                    >
                      {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Other technologies not listed:
                </label>
                <input
                  type="text"
                  value={customTechnologies}
                  onChange={(e) => setCustomTechnologies(e.target.value)}
                  placeholder="e.g. Flutter, Rust, Supabase, Kubernetes"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] text-xs text-[#111827] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Goals and preferences */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#687280] uppercase tracking-wider block">
                  Step 7 • Objectives
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">What are your primary goals?</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Select the driving motivators for your upcoming software builds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Learning or portfolio building',
                  'Academic submission or thesis',
                  'Startup or commercial business',
                  'Career development & interview prep',
                  'Personal utility / automation',
                  'Fast weekend prototype (MVP)',
                ].map((item) => {
                  const isSelected = goals.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSelection(goals, setGoals, item)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#111827] border-[#111827] text-white shadow-2xs'
                          : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#9CA3AF]'
                      }`}
                    >
                      <span>{item}</span>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Review & Complete */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider block">
                  Step 8 • Review
                </span>
                <h2 className="text-2xl font-bold text-[#111827] mt-1">Review your planning profile</h2>
                <p className="text-xs text-[#687280] mt-1">
                  Everything looks ready. You can edit any step or complete setup to open your workspace.
                </p>
              </div>

              <div className="space-y-3 text-xs divide-y divide-[#F3F4F6]">
                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111827] block">Roles:</span>
                    <span className="text-[#4B5563]">{roles.join(', ') || 'Founder or entrepreneur'}</span>
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-[#2563EB] font-semibold hover:underline">Edit</button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111827] block">Technical Background:</span>
                    <span className="text-[#4B5563]">{technicalBackground || 'General'}</span>
                  </div>
                  <button onClick={() => setCurrentStep(3)} className="text-[#2563EB] font-semibold hover:underline">Edit</button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111827] block">Experience Level:</span>
                    <span className="text-[#4B5563]">{experienceLevel || 'Learning fundamentals'}</span>
                  </div>
                  <button onClick={() => setCurrentStep(4)} className="text-[#2563EB] font-semibold hover:underline">Edit</button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111827] block">Project Interests:</span>
                    <span className="text-[#4B5563]">
                      {[...projectInterests, customProjectInterest].filter(Boolean).join(', ') || 'Web & Mobile'}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(5)} className="text-[#2563EB] font-semibold hover:underline">Edit</button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111827] block">Familiar Technologies:</span>
                    <span className="text-[#4B5563]">
                      {[...familiarTechnologies, customTechnologies].filter(Boolean).join(', ') || 'None specified'}
                    </span>
                  </div>
                  <button onClick={() => setCurrentStep(6)} className="text-[#2563EB] font-semibold hover:underline">Edit</button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#111827] block">Primary Goals:</span>
                    <span className="text-[#4B5563]">{goals.join(', ') || 'Build project'}</span>
                  </div>
                  <button onClick={() => setCurrentStep(7)} className="text-[#2563EB] font-semibold hover:underline">Edit</button>
                </div>
              </div>

              {isCompletedSuccess && (
                <div className="p-4 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] flex items-center gap-2.5 text-xs text-[#166534] font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                  <span>Onboarding preferences saved to MongoDB! Redirecting to workspace...</span>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F3F4F6]">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={handleBack}
                disabled={isLoading || isCompletedSuccess}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                variant="accent"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNext}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="accent"
                size="lg"
                className="font-bold px-6 shadow-xs"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleFinish}
                isLoading={isLoading}
                disabled={isCompletedSuccess}
              >
                Complete Setup & Open Workspace
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-4 text-center text-xs text-[#9CA3AF] border-t border-[#E5E7EB] bg-white">
        StackMatch — Plan smarter. Choose better. Build with confidence.
      </div>
    </div>
  );
};
