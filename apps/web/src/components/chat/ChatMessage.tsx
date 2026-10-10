import React from 'react';
import { User as UserIcon, Sparkles } from 'lucide-react';
import { Message } from '../../types';
import { StackMatchLogo } from '../brand/StackMatchLogo';
import { FollowUpCard } from './FollowUpCard';

export interface ChatMessageProps {
  message: Message;
  onSelectSuggestion?: (suggestion: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectSuggestion,
}) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex gap-3 my-4 max-w-3xl ${
        isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
      }`}
    >
      {/* Brand Avatar for AI / User Icon for User */}
      <div className="shrink-0 mt-0.5">
        {isAssistant ? (
          <StackMatchLogo variant="mark" size="sm" />
        ) : (
          <div className="w-6 h-6 rounded-md bg-[#374151] text-white flex items-center justify-center text-xs font-semibold">
            <UserIcon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Message Content Bubble */}
      <div className={`space-y-2 max-w-[90%] sm:max-w-xl ${isAssistant ? '' : 'text-right'}`}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-[#111827]">
            {isAssistant ? 'StackMatch AI' : 'You'}
          </span>
          <span className="text-[10px] text-[#9CA3AF]">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isAssistant && message.metadata?.stage && (
            <span className="text-[9px] font-semibold uppercase tracking-wider bg-[#F3F4F6] text-[#374151] px-1.5 py-0.2 rounded">
              {message.metadata.stage}
            </span>
          )}
        </div>

        <div
          className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left border ${
            isAssistant
              ? 'bg-white border-[#E5E7EB] text-[#111827] shadow-subtle'
              : 'bg-[#111827] border-[#111827] text-white shadow-xs'
          }`}
        >
          {message.content}
        </div>

        {/* Follow-Up Question Card if available */}
        {isAssistant && message.metadata?.followUpQuestion && (
          <FollowUpCard
            question={message.metadata.followUpQuestion}
            onSelectOption={(opt) => onSelectSuggestion && onSelectSuggestion(opt)}
          />
        )}

        {/* Suggested Response Chips */}
        {isAssistant && message.metadata?.suggestedResponses && message.metadata.suggestedResponses.length > 0 && (
          <div className="pt-1 flex flex-wrap gap-1.5 text-left">
            {message.metadata.suggestedResponses.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion && onSelectSuggestion(chip)}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-[#D1D5DB] text-[#374151] hover:border-[#111827] hover:text-[#111827] hover:bg-[#F9FAFB] transition-subtle cursor-pointer shadow-2xs font-medium text-left flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-[#2563EB]" />
                <span>{chip}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
