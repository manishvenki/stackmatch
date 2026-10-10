import React, { useState } from 'react';
import { HelpCircle, ArrowRight, Check } from 'lucide-react';
import { FollowUpQuestion } from '../../types';
import { Button } from '../ui/Button';

export interface FollowUpCardProps {
  question: FollowUpQuestion;
  onSelectOption: (option: string) => void;
  disabled?: boolean;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  question,
  onSelectOption,
  disabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
    onSelectOption(opt);
  };

  return (
    <div className="bg-white rounded-xl border border-[#D1D5DB] p-4.5 shadow-subtle max-w-xl my-2.5 transition-all">
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-6 h-6 rounded-md bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
          <HelpCircle className="w-3.5 h-3.5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#111827] leading-snug">
            {question.question}
          </h4>
          {question.context && (
            <p className="text-[11px] text-[#687280] mt-0.5 leading-relaxed">
              {question.context}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-1">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-medium border transition-subtle flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8] font-semibold'
                  : 'border-[#E5E7EB] bg-[#F9FAFB] text-[#374151] hover:border-[#D1D5DB] hover:bg-white hover:text-[#111827]'
              }`}
            >
              <span>{opt}</span>
              <span className="shrink-0 opacity-70 group-hover:opacity-100">
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                ) : (
                  <ArrowRight className="w-3 h-3 text-[#9CA3AF] group-hover:translate-x-0.5 transition-transform" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FollowUpCard;
