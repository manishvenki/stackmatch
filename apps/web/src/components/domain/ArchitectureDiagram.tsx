import React, { useState } from 'react';
import {
  Layout,
  Smartphone,
  Server,
  Database,
  CreditCard,
  HardDrive,
  ArrowDown,
  Layers,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ArchitectureNode, ArchitectureValidationReport } from '../../types';

export interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
  validationReport?: ArchitectureValidationReport | null;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  nodes,
  validationReport,
}) => {
  const [showFindings, setShowFindings] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-5 h-5 text-[#111827]" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-[#111827]" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#111827]" />;
      case 'Database':
        return <Database className="w-5 h-5 text-[#111827]" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-[#111827]" />;
      case 'HardDrive':
        return <HardDrive className="w-5 h-5 text-[#111827]" />;
      default:
        return <Layers className="w-5 h-5 text-[#111827]" />;
    }
  };

  const clientNodes = nodes.filter((n) => n.layer === 'client');
  const apiNodes = nodes.filter((n) => n.layer === 'api');
  const dataNodes = nodes.filter((n) => n.layer === 'data');
  const externalNodes = nodes.filter((n) => n.layer === 'external');

  return (
    <div className="w-full space-y-6">
      {/* Architecture Consistency Health Check Panel */}
      {validationReport && (
        <div className="bg-white rounded-xl border border-[#D1D5DB] p-5 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  validationReport.status === 'consistent'
                    ? 'bg-[#DCFCE7] text-[#16A34A]'
                    : validationReport.status === 'warnings_detected'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-[#FEE2E2] text-[#DC2626]'
                }`}
              >
                {validationReport.status === 'consistent' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : validationReport.status === 'warnings_detected' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#111827]">
                    Architecture Consistency & Health Check
                  </h4>
                  <Badge
                    variant={
                      validationReport.status === 'consistent'
                        ? 'success'
                        : validationReport.status === 'warnings_detected'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {validationReport.score}% Health Score
                  </Badge>
                </div>
                <p className="text-xs text-[#687280] mt-0.5">
                  {validationReport.summary}
                </p>
              </div>
            </div>

            {validationReport.findings?.length > 0 && (
              <button
                type="button"
                onClick={() => setShowFindings(!showFindings)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111827] hover:underline cursor-pointer shrink-0"
              >
                <span>
                  {showFindings ? 'Hide' : 'Review'} {validationReport.findings.length} Findings
                </span>
                {showFindings ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          {/* Expandable Findings Drawer */}
          {showFindings && validationReport.findings?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#E5E7EB] space-y-3">
              {validationReport.findings.map((f) => (
                <div
                  key={f.id}
                  className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[#111827] flex items-center gap-1.5">
                      {f.severity === 'critical' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                      ) : f.severity === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      )}
                      {f.title}
                    </span>
                    <Badge
                      variant={
                        f.severity === 'critical'
                          ? 'danger'
                          : f.severity === 'warning'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {f.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[#374151]">{f.description}</p>
                  <p className="text-[#DC2626] font-medium text-[11px]">
                    <span className="font-semibold">Consequence:</span> {f.consequence}
                  </p>
                  <div className="bg-white rounded p-2 border border-[#D1D5DB] text-[11px] text-[#111827]">
                    <span className="font-semibold text-[#16A34A]">Actionable Mitigation:</span>{' '}
                    {f.actionableSuggestion}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Topography Map Container */}
      <div className="w-full bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6">
        {/* Layer 1: Client Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">
              1. Client Tier (Applications)
            </span>
            <span className="text-[11px] text-[#9CA3AF]">Web & Mobile Experiences</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientNodes.map((node) => (
              <div
                key={node.id}
                className="bg-white rounded-xl border border-[#D1D5DB] p-4 shadow-subtle hover:border-[#111827] transition-subtle flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                  {getIcon(node.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#111827]">{node.name}</h4>
                    <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded">
                      {node.technology}
                    </span>
                  </div>
                  <p className="text-xs text-[#687280] mt-1 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Down Connector */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#687280] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>HTTPS / RESTful API Requests (Stateless JWT Auth)</span>
          </div>
        </div>

        {/* Layer 2: API Gateway Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">
              2. Backend Service Tier
            </span>
            <span className="text-[11px] text-[#9CA3AF]">API Gateway & Controllers</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {apiNodes.map((node) => (
              <div
                key={node.id}
                className="bg-white rounded-xl border-2 border-[#111827] p-5 shadow-sm flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#111827] text-white flex items-center justify-center shrink-0">
                  {getIcon(node.iconName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#111827]">{node.name}</h4>
                    <span className="text-xs font-mono font-bold bg-[#111827] text-white px-2.5 py-0.5 rounded-full">
                      {node.technology}
                    </span>
                  </div>
                  <p className="text-xs text-[#687280] mt-1 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Down Connector */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#687280] bg-white border border-[#E5E7EB] px-3 py-1 rounded-full shadow-2xs">
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            <span>Connection Pool & External Webhooks</span>
          </div>
        </div>

        {/* Layer 3: Persistence Tier */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">
              3. Persistence Tier
            </span>
            <span className="text-[11px] text-[#9CA3AF]">ACID Relational Storage</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {dataNodes.map((node) => (
              <div
                key={node.id}
                className="bg-white rounded-xl border border-[#D1D5DB] p-4 shadow-subtle hover:border-[#111827] transition-subtle flex items-start gap-3.5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  {getIcon(node.iconName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#111827]">{node.name}</h4>
                    <span className="text-[10px] font-medium bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded">
                      {node.technology}
                    </span>
                  </div>
                  <p className="text-xs text-[#687280] mt-1 leading-relaxed">
                    {node.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layer 4: External Services Tier */}
        {externalNodes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 pt-2 border-t border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">
                4. External Cloud Services & Gateways
              </span>
              <span className="text-[11px] text-[#9CA3AF]">Fintech, Media & Integrations</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {externalNodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-white rounded-xl border border-[#D1D5DB] p-4 shadow-subtle hover:border-[#111827] transition-subtle flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                    {getIcon(node.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#111827]">{node.name}</h4>
                      <span className="text-[10px] font-medium bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded">
                        {node.technology}
                      </span>
                    </div>
                    <p className="text-xs text-[#687280] mt-1 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
