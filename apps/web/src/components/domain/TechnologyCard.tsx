import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Technology } from '../../types';

export interface TechnologyCardProps {
  technology: Technology;
  onViewDetails?: (tech: Technology) => void;
  onCompare?: (tech: Technology) => void;
}

export const TechnologyCard: React.FC<TechnologyCardProps> = ({
  technology,
  onViewDetails,
  onCompare,
}) => {
  const [showScoreInfo, setShowScoreInfo] = useState(false);

  return (
    <Card hoverable className="flex flex-col justify-between h-full group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-semibold text-[#687280] uppercase tracking-wider block">
                {technology.category}
              </span>
              {technology.confidenceStatus && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.2 rounded">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {technology.confidenceStatus}
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-[#111827] group-hover:text-black">
              {technology.name}
            </h4>
          </div>

          <div className="flex flex-col items-end">
            <Badge
              variant={technology.matchScore >= 90 ? 'highlight' : 'neutral'}
              size="md"
              icon={<Sparkles className="w-3 h-3 text-[#E5E7EB]" />}
            >
              {technology.matchScore}% Match
            </Badge>
            {technology.scoringCriteriaExplanation && (
              <button
                type="button"
                onClick={() => setShowScoreInfo(!showScoreInfo)}
                className="text-[10px] text-[#9CA3AF] hover:text-[#111827] underline mt-0.5 cursor-pointer flex items-center gap-0.5"
              >
                <Info className="w-2.5 h-2.5" />
                Criteria
              </button>
            )}
          </div>
        </div>

        {/* Scoring Rationale Explanation Toggle */}
        {showScoreInfo && technology.scoringCriteriaExplanation && (
          <div className="bg-[#F9FAFB] rounded-lg p-2 border border-[#E5E7EB] text-[10px] text-[#4B5563] mb-2 leading-relaxed animate-in fade-in">
            <span className="font-semibold text-[#111827]">Scoring Rationale: </span>
            {technology.scoringCriteriaExplanation}
          </div>
        )}

        <p className="text-xs text-[#374151] font-medium mb-1.5">
          {technology.tagline}
        </p>

        {/* Role in Architecture */}
        {technology.roleInArchitecture && (
          <div className="text-[11px] text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md mb-2 font-medium leading-snug">
            <span className="font-semibold">Role:</span> {technology.roleInArchitecture}
          </div>
        )}

        <p className="text-xs text-[#687280] leading-relaxed line-clamp-3 mb-4">
          {technology.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
        <button
          onClick={() => onViewDetails && onViewDetails(technology)}
          className="inline-flex items-center gap-1 font-semibold text-[#111827] hover:underline cursor-pointer group-hover:text-black"
        >
          <span>View Details & Trade-offs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {onCompare && (
          <button
            onClick={() => onCompare(technology)}
            className="text-[#687280] hover:text-[#111827] font-medium text-xs cursor-pointer"
          >
            Compare Alternatives
          </button>
        )}
      </div>
    </Card>
  );
};
