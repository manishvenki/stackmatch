import React, { useState, useEffect } from 'react';
import { X, Sparkles, FolderPlus, Edit3, Target, Users, Layers, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Project, ProjectStatus } from '../../types';

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    id?: string;
    name: string;
    description: string;
    problemStatement: string;
    category: string;
    primaryUsers: string[];
    goals: string[];
    status: ProjectStatus;
  }) => Promise<void>;
  projectToEdit?: Project | null;
  isLoading?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectToEdit,
  isLoading = false,
}) => {
  const isEditing = !!projectToEdit;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [category, setCategory] = useState('Web & Mobile Application');
  const [targetUsersInput, setTargetUsersInput] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('draft');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || '');
      setDescription(projectToEdit.description || '');
      setProblemStatement(
        projectToEdit.problemStatement ||
          projectToEdit.summary?.problemStatement ||
          projectToEdit.description ||
          ''
      );
      setCategory(
        projectToEdit.category ||
          projectToEdit.summary?.projectType ||
          projectToEdit.summary?.industry ||
          'Web & Mobile Application'
      );
      setTargetUsersInput(
        (projectToEdit.summary?.primaryUsers || projectToEdit.summary?.targetAudience || []).join(
          ', '
        )
      );
      setGoalsInput((projectToEdit.summary?.goals || []).join('\n'));
      setStatus(projectToEdit.status || 'draft');
    } else {
      setName('');
      setDescription('');
      setProblemStatement('');
      setCategory('Web & Mobile Application');
      setTargetUsersInput('Students, Vendors, Admins');
      setGoalsInput('Make ordering fast during short class breaks\nSupport seamless online payments');
      setStatus('draft');
    }
    setValidationError('');
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Project name is required.');
      return;
    }

    const primaryUsers = targetUsersInput
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean);

    const goals = goalsInput
      .split('\n')
      .map((g) => g.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        id: projectToEdit?.id,
        name: name.trim(),
        description: description.trim(),
        problemStatement: problemStatement.trim() || description.trim(),
        category,
        primaryUsers: primaryUsers.length > 0 ? primaryUsers : ['End Users', 'Administrators'],
        goals: goals.length > 0 ? goals : ['Launch minimum viable product'],
        status,
      });
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save project.');
    }
  };

  const categories = [
    'Web & Mobile Application',
    'SaaS Web Platform',
    'E-Commerce & Food Ordering',
    'Marketplace Platform',
    'Mobile Application (iOS / Android)',
    'Developer Tools & APIs',
    'Enterprise Internal Tool',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#111827]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111827] text-white flex items-center justify-center shadow-xs">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">
                {isEditing ? 'Edit Project Idea' : 'Create New Project Idea'}
              </h3>
              <p className="text-xs text-[#687280]">
                {isEditing
                  ? 'Update saved planning details. Architecture and requirements will remain intact.'
                  : 'Start with your core idea. AI planning intelligence will enrich the full specification.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-[#111827] rounded-lg hover:bg-[#F3F4F6] transition-subtle cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Project Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError('');
              }}
              placeholder="e.g. College Food Ordering Platform"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle"
              autoFocus
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Short Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="A brief summary of what this product enables for its users."
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle resize-none"
            />
          </div>

          {/* Problem Statement */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Problem Statement
            </label>
            <textarea
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows={2}
              placeholder="What core problem or friction does this platform resolve?"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle resize-none"
            />
          </div>

          {/* Two-Column: Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Project Category / Type
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle bg-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle bg-white cursor-pointer"
              >
                <option value="draft">Draft Idea</option>
                <option value="in-progress">In-Progress Planning</option>
                <option value="completed">Completed Specification</option>
              </select>
            </div>
          </div>

          {/* Target Users */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Target Users (Comma-separated)
            </label>
            <input
              type="text"
              value={targetUsersInput}
              onChange={(e) => setTargetUsersInput(e.target.value)}
              placeholder="e.g. Students, Restaurant Managers, Admin"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle"
            />
          </div>

          {/* Project Objectives */}
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">
              Core Objectives (One per line)
            </label>
            <textarea
              value={goalsInput}
              onChange={(e) => setGoalsInput(e.target.value)}
              rows={3}
              placeholder="e.g.&#10;Sub-second real-time order notifications&#10;UPI payment processing integration"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#111827] transition-subtle font-mono resize-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-end gap-2.5">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              type="submit"
              isLoading={isLoading}
              className="font-bold shadow-xs"
            >
              {isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
