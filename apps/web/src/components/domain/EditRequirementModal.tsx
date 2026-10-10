import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Requirement } from '../../types';

export interface EditRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: Requirement | null;
  onSave: (updatedReq: Partial<Requirement> & { id: string }) => Promise<void>;
  onDelete?: (requirementId: string) => Promise<void>;
}

export const EditRequirementModal: React.FC<EditRequirementModalProps> = ({
  isOpen,
  onClose,
  requirement,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'functional' | 'non-functional'>('functional');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('');
  const [userStory, setUserStory] = useState('');
  const [isMvpScope, setIsMvpScope] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (requirement) {
      setTitle(requirement.title);
      setDescription(requirement.description);
      setType(requirement.type);
      setPriority(requirement.priority);
      setCategory(requirement.category || '');
      setUserStory(requirement.userStory || '');
      setIsMvpScope(requirement.isMvpScope !== undefined ? requirement.isMvpScope : true);
    }
  }, [requirement]);

  if (!isOpen || !requirement) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        id: requirement.id,
        title: title.trim(),
        description: description.trim(),
        type,
        priority,
        category: category.trim() || undefined,
        userStory: userStory.trim() || undefined,
        isMvpScope,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (window.confirm(`Are you sure you want to remove requirement "${requirement.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(requirement.id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#D1D5DB] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F3F4F6] text-[#111827] flex items-center justify-center">
              {type === 'functional' ? <Zap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-[#111827]">Edit Requirement</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] p-1.5 rounded-lg transition-subtle cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#374151] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm focus:outline-hidden focus:border-[#111827] text-[#111827]"
              placeholder="e.g. Real-time Order Tracking"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#374151] mb-1">Requirement Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-xs bg-white text-[#111827] focus:outline-hidden focus:border-[#111827]"
              >
                <option value="functional">Functional</option>
                <option value="non-functional">Non-Functional</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-xs bg-white text-[#111827] focus:outline-hidden focus:border-[#111827]"
              >
                <option value="high">High (Core)</option>
                <option value="medium">Medium</option>
                <option value="low">Low (Future)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#374151] mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-xs focus:outline-hidden focus:border-[#111827] text-[#111827]"
                placeholder="e.g. Operations, Security, UX"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMvpScope}
                  onChange={(e) => setIsMvpScope(e.target.checked)}
                  className="rounded border-[#D1D5DB] text-[#111827] focus:ring-0"
                />
                <span className="font-semibold text-[#111827] text-xs">Included in MVP Scope</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-xs focus:outline-hidden focus:border-[#111827] text-[#111827]"
              placeholder="Detailed description of what the system will accomplish..."
            />
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1">User Story (Agile format)</label>
            <input
              type="text"
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-xs focus:outline-hidden focus:border-[#111827] text-[#111827]"
              placeholder="As a [role], I want to [action] so that [benefit]"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-[#DC2626] hover:text-[#991B1B] font-semibold flex items-center gap-1.5 p-1.5 rounded-md hover:bg-[#FEF2F2] transition-subtle cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
