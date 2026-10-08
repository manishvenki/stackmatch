import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
  return (
    <Card hoverable className="flex flex-col justify-between h-full group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-semibold text-[#687280] uppercase tracking-wider block mb-0.5">
              {technology.category}
            </span>
            <h4 className="text-base font-bold text-[#111827] group-hover:text-black">
              {technology.name}
            </h4>
          </div>
          <Badge
            variant={technology.matchScore >= 90 ? 'highlight' : 'neutral'}
            size="md"
            icon={<Sparkles className="w-3 h-3 text-[#E5E7EB]" />}
          >
            {technology.matchScore}% Match
          </Badge>
        </div>

        <p className="text-xs text-[#374151] font-medium mb-1.5">
          {technology.tagline}
        </p>

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
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>

        {technology.category === 'Database' && onCompare && (
          <button
            onClick={() => onCompare(technology)}
            className="text-[#687280] hover:text-[#111827] font-medium text-xs cursor-pointer"
          >
            Compare
          </button>
        )}
      </div>
    </Card>
  );
};
