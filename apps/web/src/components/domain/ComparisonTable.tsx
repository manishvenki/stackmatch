import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { TechComparisonGroup } from '../../types';

export interface ComparisonTableProps {
  comparisonGroup: TechComparisonGroup;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparisonGroup }) => {
  const { technologies } = comparisonGroup;

  return (
    <div className="w-full">
      {/* Responsive Desktop / Tablet Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white shadow-subtle">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
              <th className="py-4 px-5 text-xs font-semibold text-[#687280] uppercase tracking-wider w-1/4">
                Criteria
              </th>
              {technologies.map((tech) => (
                <th
                  key={tech.name}
                  className={`py-4 px-5 text-sm font-bold text-[#111827] w-1/4 ${
                    tech.isRecommended ? 'bg-[#F3F4F6]/70' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base">{tech.name}</span>
                    {tech.isRecommended && (
                      <Badge variant="highlight" size="sm" icon={<Sparkles className="w-2.5 h-2.5" />}>
                        Recommended
                      </Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs">
            {/* Match Score */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Match Score</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 ${tech.isRecommended ? 'bg-[#F3F4F6]/50 font-bold' : ''}`}
                >
                  <span className="text-sm font-bold text-[#111827]">{tech.matchScore}%</span>
                </td>
              ))}
            </tr>

            {/* Data Structure */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Data Structure</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] ${tech.isRecommended ? 'bg-[#F3F4F6]/50' : ''}`}
                >
                  {tech.dataStructure || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Relationships */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Relationships</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] ${tech.isRecommended ? 'bg-[#F3F4F6]/50' : ''}`}
                >
                  {tech.relationships || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Scalability */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Scalability</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] ${tech.isRecommended ? 'bg-[#F3F4F6]/50' : ''}`}
                >
                  {tech.scalability}
                </td>
              ))}
            </tr>

            {/* Learning Curve */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Learning Curve</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] ${tech.isRecommended ? 'bg-[#F3F4F6]/50' : ''}`}
                >
                  {tech.learningCurve}
                </td>
              ))}
            </tr>

            {/* Best For */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Best For</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] leading-relaxed ${
                    tech.isRecommended ? 'bg-[#F3F4F6]/50 font-medium' : ''
                  }`}
                >
                  {tech.bestFor}
                </td>
              ))}
            </tr>

            {/* Real-world Usage */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Real-world Usage</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] ${tech.isRecommended ? 'bg-[#F3F4F6]/50' : ''}`}
                >
                  {tech.realWorldUsage}
                </td>
              ))}
            </tr>

            {/* Community */}
            <tr className="hover:bg-[#F9FAFB]/50 transition-subtle">
              <td className="py-3.5 px-5 font-semibold text-[#374151]">Community</td>
              {technologies.map((tech) => (
                <td
                  key={tech.name}
                  className={`py-3.5 px-5 text-[#374151] ${tech.isRecommended ? 'bg-[#F3F4F6]/50' : ''}`}
                >
                  {tech.community}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#687280]">
        <span>← Scroll horizontally to inspect full side-by-side matrices →</span>
        <span className="flex items-center gap-1 font-medium text-[#111827]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Recommended option highlighted
        </span>
      </div>
    </div>
  );
};
