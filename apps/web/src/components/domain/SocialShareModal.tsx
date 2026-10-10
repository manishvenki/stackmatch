import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageCircle, Send, Globe } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Project, ProjectBlueprint } from '../../types';

export interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  blueprint?: ProjectBlueprint | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  project,
  blueprint,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const publicUrl = window.location.origin;
  const projectName = project.name || 'My Software Project';
  const projectSummary = project.description || project.summary?.projectType || 'Software Application Plan';

  const defaultShareMessage = `I've created a project blueprint using StackMatch, an AI-powered project planning studio.

Project: ${projectName}
Overview: ${projectSummary}

The blueprint covers the planned features, requirements, technology stack, architecture, and implementation roadmap.

Plan smarter. Choose better. Build with confidence.
Explore StackMatch: ${publicUrl}
Planned with StackMatch — Plan smarter. Choose better. Build with confidence.`;

  const shareSubject = `Project Blueprint — ${projectName}`;

  // Platform specific URLs
  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}&title=${encodeURIComponent(shareSubject)}&summary=${encodeURIComponent(defaultShareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultShareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareGmail = () => {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(defaultShareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(defaultShareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareX = () => {
    const tweetText = `I planned "${projectName}" using @StackMatch — AI-powered software planning studio.\n\nPlan smarter. Choose better. Build with confidence.\n${publicUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(defaultShareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Project Blueprint" maxWidth="md">
      <div className="space-y-6">
        <div>
          <p className="text-xs text-[#4B5563]">
            Share the engineering blueprint for <span className="font-bold text-[#111827]">{projectName}</span> across professional and team networks.
          </p>
        </div>

        {/* Social Sharing Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="p-3 rounded-xl border border-[#D1D5DB] hover:border-[#0A66C2] hover:bg-[#F0F7FF] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              in
            </div>
            <span className="text-xs font-semibold text-[#111827] group-hover:text-[#0A66C2]">
              LinkedIn
            </span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="p-3 rounded-xl border border-[#D1D5DB] hover:border-[#25D366] hover:bg-[#F0FDF4] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#111827] group-hover:text-[#25D366]">
              WhatsApp
            </span>
          </button>

          <button
            type="button"
            onClick={handleShareGmail}
            className="p-3 rounded-xl border border-[#D1D5DB] hover:border-[#EA4335] hover:bg-[#FEF2F2] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#EA4335] text-white flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#111827] group-hover:text-[#EA4335]">
              Gmail
            </span>
          </button>

          <button
            type="button"
            onClick={handleShareTelegram}
            className="p-3 rounded-xl border border-[#D1D5DB] hover:border-[#229ED9] hover:bg-[#F0F9FF] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-[#111827] group-hover:text-[#229ED9]">
              Telegram
            </span>
          </button>

          <button
            type="button"
            onClick={handleShareX}
            className="p-3 rounded-xl border border-[#D1D5DB] hover:border-[#111827] hover:bg-[#F9FAFB] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              𝕏
            </div>
            <span className="text-xs font-semibold text-[#111827]">
              X (Twitter)
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-3 rounded-xl border border-[#D1D5DB] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </div>
            <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB]">
              {copied ? 'Copied!' : 'Copy Summary'}
            </span>
          </button>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#687280] uppercase tracking-wider">
              Message Preview
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#374151] font-mono whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
            {defaultShareMessage}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
