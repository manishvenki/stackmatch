import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Loader2 } from 'lucide-react';

export interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  draftText?: string;
  onDraftChange?: (val: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = 'Describe your idea...',
  draftText,
  onDraftChange,
}) => {
  const [text, setText] = useState(draftText || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync draftText updates from parent (e.g. restoring failed message)
  useEffect(() => {
    if (draftText !== undefined && draftText !== text) {
      setText(draftText);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        textareaRef.current.focus();
      }
    }
  }, [draftText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading || disabled) return;
    const submittedText = text.trim();
    onSend(submittedText);
    setText('');
    if (onDraftChange) onDraftChange('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    if (onDraftChange) onDraftChange(val);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="w-full bg-white border border-[#D1D5DB] rounded-2xl p-2 shadow-subtle focus-within:border-[#111827] focus-within:ring-1 focus-within:ring-[#111827] transition-subtle">
      <div className="flex items-end gap-2 px-1">
        {/* Attachment placeholder */}
        <button
          type="button"
          title="Attach document or reference (Coming Soon)"
          className="p-2 text-[#9CA3AF] hover:text-[#374151] rounded-lg transition-subtle cursor-pointer shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none text-sm text-[#111827] placeholder-[#9CA3AF] bg-transparent focus:outline-none py-1.5 leading-relaxed max-h-40 min-h-[28px]"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading || disabled}
          aria-label="Send message"
          className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center transition-subtle disabled:opacity-40 disabled:pointer-events-none hover:bg-[#1f2937] shrink-0 cursor-pointer shadow-2xs"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
};
