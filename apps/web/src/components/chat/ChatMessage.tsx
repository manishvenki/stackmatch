import React from 'react';
import { Layers, User as UserIcon } from 'lucide-react';
import { Message } from '../../types';

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
      className={`flex gap-3.5 my-4 max-w-3xl ${
        isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
          isAssistant
            ? 'bg-[#111827] text-white shadow-xs'
            : 'bg-[#E5E7EB] text-[#374151]'
        }`}
      >
        {isAssistant ? (
          <Layers className="w-4 h-4 stroke-[2.2]" />
        ) : (
          <UserIcon className="w-4 h-4" />
        )}
      </div>

      {/* Message Content Bubble */}
      <div className={`space-y-2 max-w-[88%] sm:max-w-xl ${isAssistant ? '' : 'text-right'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-[#111827]">
            {isAssistant ? 'StackMatch' : 'You'}
          </span>
          <span className="text-[10px] text-[#9CA3AF]">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line text-left ${
            isAssistant
              ? 'bg-white border border-[#E5E7EB] text-[#111827] shadow-subtle'
              : 'bg-[#111827] text-white shadow-xs'
          }`}
        >
          {message.content}
        </div>

        {/* Suggested Response Chips */}
        {isAssistant && message.metadata?.suggestedResponses && message.metadata.suggestedResponses.length > 0 && (
          <div className="pt-1.5 flex flex-wrap gap-2 text-left">
            {message.metadata.suggestedResponses.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion && onSelectSuggestion(chip)}
                className="text-xs px-3 py-1.5 rounded-full bg-white border border-[#D1D5DB] text-[#374151] hover:border-[#111827] hover:text-[#111827] hover:bg-[#F9FAFB] transition-subtle cursor-pointer shadow-2xs font-medium text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
