import React, { useState } from 'react';
import {
  User,
  Settings,
  Shield,
  GraduationCap,
  LogOut,
  CheckCircle2,
  Database,
  Key,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { User as UserType } from '../types';
import { api } from '../services/api';

export interface WorkspaceSettingsPageProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onRestartOnboarding?: () => void;
}

export const WorkspaceSettingsPage: React.FC<WorkspaceSettingsPageProps> = ({
  currentUser,
  onLogout,
  onRestartOnboarding,
}) => {
  const onboarding = currentUser?.onboardingResponses;

  return (
    <div className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Manage your account credentials, planning profile, and persistent session preferences.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="text-[#DC2626] hover:bg-[#FEF2F2] border-[#FECACA] self-start sm:self-auto cursor-pointer"
          leftIcon={<LogOut className="w-4 h-4 text-[#DC2626]" />}
          onClick={onLogout}
        >
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 border-b border-[#F3F4F6] pb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-extrabold text-xl shadow-xs">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#111827]">{currentUser?.name || 'Anonymous User'}</h3>
                <Badge variant="success">Active Account</Badge>
              </div>
              <p className="text-xs text-[#687280] mt-0.5">{currentUser?.email || 'No email associated'}</p>
              {currentUser?.username && (
                <p className="text-[11px] font-mono text-[#2563EB] mt-0.5">@{currentUser.username}</p>
              )}
            </div>
          </div>

          {/* Account Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                Account ID (MongoDB Key)
              </span>
              <span className="font-mono text-[#111827] text-xs select-all">
                {currentUser?.id || 'usr_local'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                Security & Role
              </span>
              <span className="font-bold text-[#111827] capitalize">
                {currentUser?.role || 'Founder / Project Owner'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                Member Since
              </span>
              <span className="font-medium text-[#111827]">
                {currentUser?.createdAt
                  ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'Recent Session'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#687280] block mb-1">
                Onboarding Status
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-[#16A34A]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {currentUser?.onboardingCompleted ? 'Profile Calibrated' : 'Pending Profile'}
              </span>
            </div>
          </div>

          {/* Calibrated Planning Background */}
          {onboarding && (
            <div className="space-y-3 pt-2 border-t border-[#F3F4F6]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Calibrated Planning Background
                </h4>
                {onRestartOnboarding && (
                  <button
                    onClick={onRestartOnboarding}
                    className="text-xs text-[#2563EB] font-semibold hover:underline cursor-pointer"
                  >
                    Re-calibrate Profile
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <span className="text-[10px] text-[#687280] block font-semibold">User Role(s)</span>
                  <span className="font-medium text-[#111827]">{onboarding.roles?.join(', ') || 'Founder'}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <span className="text-[10px] text-[#687280] block font-semibold">Technical Background</span>
                  <span className="font-medium text-[#111827]">{onboarding.technicalBackground || 'General'}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <span className="text-[10px] text-[#687280] block font-semibold">Experience Level</span>
                  <span className="font-medium text-[#111827]">{onboarding.experienceLevel || 'Learning'}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                  <span className="text-[10px] text-[#687280] block font-semibold">Key Technologies</span>
                  <span className="font-medium text-[#111827]">
                    {onboarding.familiarTechnologies?.join(', ') || 'Multi-stack'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Security & System Info Side Card */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h4 className="text-sm font-bold text-[#111827]">Session & Encryption</h4>
            <div className="space-y-3 text-xs text-[#4B5563]">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>JWT token authenticated with bcrypt credential hashing</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Database className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <span>Projects and conversations isolated by user ID in MongoDB</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Key className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>Zero client-side secrets exposure</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-3 bg-[#111827] text-white">
            <h4 className="text-sm font-bold text-white">StackMatch Planning Studio</h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Designed for entrepreneurs, technical teams, and students seeking to convert raw ideas into production architecture.
            </p>
            <div className="pt-2">
              <span className="text-[10px] text-[#9CA3AF] block font-mono">
                Environment: Production Verified
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
