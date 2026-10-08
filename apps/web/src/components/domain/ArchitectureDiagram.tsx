import React from 'react';
import {
  Layout,
  Smartphone,
  Server,
  Database,
  CreditCard,
  HardDrive,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { ArchitectureNode } from '../../types';

export interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ nodes }) => {
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
          <span>HTTPS / RESTful API Requests</span>
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
                <Server className="w-5 h-5 text-white" />
              </div>
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#111827]">{node.name}</h4>
                    <span className="text-[10px] font-semibold bg-[#111827] text-white px-2 py-0.5 rounded">
                      {node.technology}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                    Core Gateway
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
          <span>ACID Transactions & Secure External Webhooks</span>
        </div>
      </div>

      {/* Layer 3: Persistence & Integrations Tier */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#687280] uppercase tracking-wider">
            3. Persistence & External Services
          </span>
          <span className="text-[11px] text-[#9CA3AF]">Database & Third-Party Gateways</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...dataNodes, ...externalNodes].map((node) => (
            <div
              key={node.id}
              className="bg-white rounded-xl border border-[#D1D5DB] p-4 shadow-subtle hover:border-[#111827] transition-subtle flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                {getIcon(node.iconName)}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-[#111827]">{node.name}</h4>
                </div>
                <span className="text-[10px] font-medium text-[#687280] block mb-1">
                  {node.technology}
                </span>
                <p className="text-[11px] text-[#687280] leading-snug">
                  {node.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
