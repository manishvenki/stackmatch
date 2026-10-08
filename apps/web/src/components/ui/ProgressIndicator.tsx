import React from 'react';
import { Check } from 'lucide-react';
import { ProjectStage } from '../../types';

interface StageConfig {
  id: ProjectStage;
  step: number;
  label: string;
}

const STAGES: StageConfig[] = [
  { id: 'idea', step: 1, label: 'Idea' },
  { id: 'requirements', step: 2, label: 'Requirements' },
  { id: 'planning', step: 3, label: 'Planning' },
  { id: 'finalize', step: 4, label: 'Finalize' },
];

export interface ProgressIndicatorProps {
  currentStage: ProjectStage;
  onSelectStage?: (stage: ProjectStage) => void;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStage,
  onSelectStage,
  className = '',
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={`flex items-center gap-1.5 sm:gap-3 ${className}`}>
      {STAGES.map((s, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <React.Fragment key={s.id}>
            <button
              onClick={() => onSelectStage && onSelectStage(s.id)}
              disabled={!onSelectStage}
              className={`flex items-center gap-2 group transition-subtle ${
                onSelectStage ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-subtle ${
                  isCurrent
                    ? 'bg-[#111827] text-white shadow-xs'
                    : isCompleted
                    ? 'bg-[#E5E7EB] text-[#111827]'
                    : 'bg-[#F3F4F6] text-[#9CA3AF]'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : s.step}
              </div>
              <span
                className={`text-xs font-medium hidden md:inline transition-subtle ${
                  isCurrent
                    ? 'text-[#111827] font-semibold'
                    : isCompleted
                    ? 'text-[#374151]'
                    : 'text-[#9CA3AF]'
                }`}
              >
                {s.label}
              </span>
            </button>
            {idx < STAGES.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-[1.5px] transition-subtle ${
                  idx < currentIndex ? 'bg-[#111827]' : 'bg-[#E5E7EB]'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
