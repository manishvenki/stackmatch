import React from 'react';
import { CheckCircle2, Shield, Zap, Layers } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Requirement } from '../../types';

export interface RequirementCardProps {
  requirement: Requirement;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({ requirement }) => {
  const isFunctional = requirement.type === 'functional';

  const priorityVariant = {
    high: 'danger',
    medium: 'warning',
    low: 'neutral',
  } as const;

  const IconComponent = isFunctional ? Zap : Shield;

  return (
    <Card hoverable className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] text-[#374151] flex items-center justify-center shrink-0">
              <IconComponent className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <h4 className="text-sm font-semibold text-[#111827] group-hover:text-black">
              {requirement.title}
            </h4>
          </div>
          <Badge
            variant={priorityVariant[requirement.priority] || 'neutral'}
            size="sm"
          >
            {requirement.priority.toUpperCase()} PRIORITY
          </Badge>
        </div>

        <p className="text-xs text-[#687280] leading-relaxed line-clamp-3 mb-3">
          {requirement.description}
        </p>
      </div>

      <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#9CA3AF]">
        <span>{requirement.category || (isFunctional ? 'Functional' : 'Non-Functional')}</span>
        <span className="flex items-center gap-1 text-[#16A34A] font-medium">
          <CheckCircle2 className="w-3 h-3" /> Planned
        </span>
      </div>
    </Card>
  );
};
