import React from 'react';
import { CheckCircle2, Circle, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
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
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 sm:p-6 shadow-subtle group-hover:border-[#D1D5DB] transition-subtle space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-[#111827]">
                    {phase.title}
                  </h4>
                  {phase.objective && (
                    <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                      {phase.objective}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
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

              {/* Prerequisites & Risks */}
              {((phase.prerequisites && phase.prerequisites.length > 0) ||
                (phase.potentialRisks && phase.potentialRisks.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                  {phase.prerequisites && phase.prerequisites.length > 0 && (
                    <div className="bg-[#F9FAFB] rounded-md p-2 border border-[#E5E7EB] text-[#374151]">
                      <span className="font-semibold text-[#111827] flex items-center gap-1 mb-0.5">
                        <ArrowRight className="w-3 h-3 text-[#2563EB]" /> Prerequisites:
                      </span>
                      <span>{phase.prerequisites.join(' • ')}</span>
                    </div>
                  )}
                  {phase.potentialRisks && phase.potentialRisks.length > 0 && (
                    <div className="bg-[#FEF2F2]/60 rounded-md p-2 border border-[#FEE2E2] text-[#991B1B]">
                      <span className="font-semibold text-[#DC2626] flex items-center gap-1 mb-0.5">
                        <AlertTriangle className="w-3 h-3" /> Risk Consideration:
                      </span>
                      <span>{phase.potentialRisks.join(' • ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Deliverables Checklist with Acceptance Criteria */}
              <div className="pt-2 border-t border-[#F3F4F6] space-y-2">
                <span className="text-[11px] font-bold text-[#687280] uppercase tracking-wider block">
                  Deliverables & Acceptance Criteria
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {phase.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAFAFA] rounded-lg p-2.5 border border-[#E5E7EB] flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-2 text-xs text-[#111827]">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            item.completed ? 'text-[#16A34A]' : 'text-[#D1D5DB]'
                          }`}
                        />
                        <span className={item.completed ? 'font-semibold' : 'text-[#374151]'}>
                          {item.title}
                        </span>
                      </div>

                      {item.acceptanceCriteria && item.acceptanceCriteria.length > 0 && (
                        <div className="mt-2 pl-6 space-y-0.5 text-[10px] text-[#687280]">
                          {item.acceptanceCriteria.map((ac, acIdx) => (
                            <div key={acIdx} className="flex items-start gap-1">
                              <span className="text-[#9CA3AF]">•</span>
                              <span>{ac}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
