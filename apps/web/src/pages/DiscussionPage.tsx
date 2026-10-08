import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Layers, Menu, Sparkles } from 'lucide-react';
import { ProgressIndicator } from '../components/ui/ProgressIndicator';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Message, Project, ProjectStage } from '../types';

export interface DiscussionPageProps {
  project: Project;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  onViewProjectPlan: () => void;
  onOpenMobileSidebar?: () => void;
}

export const DiscussionPage: React.FC<DiscussionPageProps> = ({
  project,
  messages,
  onSendMessage,
  isLoading = false,
  onViewProjectPlan,
  onOpenMobileSidebar,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              <h2 className="text-sm sm:text-base font-bold text-[#111827] truncate max-w-[200px] sm:max-w-md">
                {project.name}
              </h2>
              <Badge variant="highlight" size="sm">
                AI Studio
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

        {/* Right CTA to jump into generated plan */}
        <Button
          variant="primary"
          size="sm"
          onClick={onViewProjectPlan}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          <span className="hidden sm:inline">View Project Plan</span>
          <span className="sm:hidden">Plan</span>
        </Button>
      </div>

      {/* Mobile Stage Progress Bar */}
      <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-2 flex justify-center">
        <ProgressIndicator currentStage={project.currentStage} />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 max-w-4xl w-full mx-auto">
        <div className="text-center py-2">
          <span className="text-[11px] text-[#9CA3AF] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full">
            Project scoping initiated for {project.name}
          </span>
        </div>

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onSelectSuggestion={(suggestion) => onSendMessage(suggestion)}
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#687280] bg-white border border-[#E5E7EB] p-3 rounded-2xl w-fit shadow-2xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#111827] animate-spin" />
            <span>Analyzing requirements and evaluating technology trade-offs...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock at Bottom */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-[#E5E7EB] shrink-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={onSendMessage}
            isLoading={isLoading}
            placeholder="Describe your idea or reply to the questions above..."
          />
          <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mt-2 px-1">
            <span>Press Enter to send, Shift + Enter for new lines</span>
            <span className="hidden sm:inline">StackMatch automatically identifies requirements & tech options</span>
          </div>
        </div>
      </div>
    </div>
  );
};
