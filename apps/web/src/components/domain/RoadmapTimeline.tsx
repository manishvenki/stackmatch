import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { RoadmapPhase } from '../../types';

export interface RoadmapTimelineProps {
  phases: RoadmapPhase[];
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ phases }) => {
  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#E5E7EB]">
      {phases.map((phase) => {
        const isCompleted = phase.status === 'completed';
        const isInProgress = phase.status === 'in-progress';

        return (
          <div key={phase.phaseNumber} className="relative group">
            {/* Timeline Marker Bullet */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-subtle z-10 ${
                isCompleted
                  ? 'bg-[#16A34A] text-white ring-4 ring-white'
                  : isInProgress
                  ? 'bg-[#111827] text-white ring-4 ring-white shadow-xs'
                  : 'bg-white border-2 border-[#D1D5DB] text-[#9CA3AF]'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : isInProgress ? (
                <Clock className="w-3 h-3 animate-spin" />
              ) : (
                <Circle className="w-2.5 h-2.5 fill-current" />
              )}
            </div>

            {/* Phase Card */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 shadow-subtle group-hover:border-[#D1D5DB] transition-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-base font-bold text-[#111827]">
                    {phase.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral" size="sm">
                    {phase.duration}
                  </Badge>
                  <Badge
                    variant={
                      isCompleted ? 'success' : isInProgress ? 'highlight' : 'neutral'
                    }
                    size="sm"
                  >
                    {isCompleted
                      ? 'Completed'
                      : isInProgress
                      ? 'In Progress'
                      : 'Upcoming'}
                  </Badge>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#F3F4F6]">
                {phase.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#374151]">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        item.completed ? 'text-[#16A34A]' : 'text-[#D1D5DB]'
                      }`}
                    />
                    <span className={item.completed ? 'font-medium' : 'text-[#687280]'}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
