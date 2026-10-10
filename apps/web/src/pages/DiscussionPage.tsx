import React, { useEffect, useRef } from 'react';
import { ArrowRight, Menu, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Message, Project } from '../types';

export interface DiscussionPageProps {
  project: Project;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  onViewProjectPlan: () => void;
  onGeneratePlan?: () => Promise<void>;
  isGeneratingPlan?: boolean;
  onOpenMobileSidebar?: () => void;
}

export const DiscussionPage: React.FC<DiscussionPageProps> = ({
  project,
  messages,
  onSendMessage,
  isLoading = false,
  onViewProjectPlan,
  onGeneratePlan,
  isGeneratingPlan = false,
  onOpenMobileSidebar,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isGeneratingPlan]);

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F9FAFB] overflow-hidden">
      {/* Discussion Top Bar */}
      <div className="h-16 px-4 sm:px-6 bg-white border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {onOpenMobileSidebar && (
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-1.5 text-[#687280] hover:text-[#111827] rounded-md"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#111827] truncate max-w-[180px] sm:max-w-md">
                {project.name}
              </h2>
              <Badge variant="highlight" size="sm">
                AI Planning Studio
              </Badge>
            </div>
            <p className="text-[11px] text-[#687280] hidden sm:block">
              Interactive scoping & architectural alignment session
            </p>
          </div>
        </div>

        {/* Center Progress Steps */}
        <div className="hidden md:flex items-center">
          <ProgressIndicator currentStage={project.currentStage} />
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          {onGeneratePlan && (
            <Button
              variant="accent"
              size="sm"
              onClick={onGeneratePlan}
              isLoading={isGeneratingPlan}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              <span className="hidden sm:inline">Generate Complete Plan</span>
              <span className="sm:hidden">Generate Plan</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onViewProjectPlan}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">View Project Plan</span>
            <span className="sm:hidden">Plan</span>
          </Button>
        </div>
      </div>

      {/* Mobile Stage Progress Bar */}
      <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-2 flex justify-center">
        <ProgressIndicator currentStage={project.currentStage} />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 max-w-4xl w-full mx-auto">
        <div className="text-center py-2">
          <span className="text-[11px] text-[#687280] bg-white border border-[#E5E7EB] px-3.5 py-1.5 rounded-full shadow-2xs font-medium">
            AI Scoping Session Initiated • Describe your idea naturally
          </span>
        </div>

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSelectSuggestion={(suggestion) => onSendMessage(suggestion)}
          />
        ))}

        {/* AI Loading State */}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-[#374151] bg-white border border-[#E5E7EB] p-3.5 rounded-2xl w-fit shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#2563EB] animate-spin" />
            <span className="font-medium">Analyzing product scope and evaluating technology trade-offs...</span>
          </div>
        )}

        {/* Plan Generation Banner when ready */}
        {hasUserMessages && onGeneratePlan && !isGeneratingPlan && (
          <div className="mt-6 p-4 rounded-xl bg-white border border-[#D1D5DB] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#111827]">
                  Ready to synthesize your complete engineering plan?
                </h4>
                <p className="text-[11px] text-[#687280] mt-0.5">
                  Generate structured functional requirements, suitability-scored tech stack, 3-tier architecture, and delivery roadmap.
                </p>
              </div>
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={onGeneratePlan}
              className="shrink-0"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate Complete Plan
            </Button>
          </div>
        )}

        {isGeneratingPlan && (
          <div className="p-4 rounded-xl bg-[#111827] text-white flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-[#60A5FA]" />
            <div>
              <span className="text-xs font-bold block">Synthesizing Comprehensive Engineering Plan...</span>
              <span className="text-[11px] text-[#9CA3AF]">
                Drafting requirements, calculating suitability scores, structuring architecture, and phasing roadmap.
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock at Bottom */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-[#E5E7EB] shrink-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading || isGeneratingPlan}
            placeholder="Describe your idea or reply to the questions above..."
          />
          <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mt-2 px-1">
            <span>Press Enter to send, Shift + Enter for new line</span>
            <span className="hidden sm:inline">StackMatch automatically identifies requirements & tech options</span>
          </div>
        </div>
      </div>
    </div>
  );
};
