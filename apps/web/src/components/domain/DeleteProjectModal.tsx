import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Project } from '../../types';

export interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  project: Project | null;
  isLoading?: boolean;
}

export const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  project,
  isLoading = false,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111827]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center shrink-0 border border-[#FEE2E2]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Delete Project Plan</h3>
              <p className="text-xs text-[#687280]">This action cannot be undone.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#374151] space-y-1">
            <span className="font-bold text-[#111827] block truncate">{project.name}</span>
            <p className="text-[11px] text-[#687280] leading-relaxed">
              Deleting this project will permanently remove its scoped requirements, tech stack recommendations, architecture topography, and roadmap milestones.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onConfirm}
              isLoading={isLoading}
              className="bg-[#DC2626] hover:bg-[#B91C1C] border-[#DC2626] text-white font-bold"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
