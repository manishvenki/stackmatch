import React from 'react';
import {
  PlusCircle,
  FolderKanban,
  LayoutTemplate,
  BookOpen,
  Settings,
  Layers,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { User, Project } from '../../types';

export interface SidebarProps {
  currentNav: string;
  onSelectNav: (nav: string) => void;
  onNewProject: () => void;
  projects?: Project[];
  activeProjectId?: string;
  onSelectProject?: (id: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  onSelectNav,
  onNewProject,
  projects = [],
  activeProjectId,
  onSelectProject,
  currentUser,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'projects', label: 'My Projects', icon: FolderKanban },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] h-full flex flex-col justify-between select-none">
      <div>
        {/* Workspace Brand / Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold">
              <Layers className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111827] tracking-tight">StackMatch</h2>
              <p className="text-[10px] text-[#687280] font-medium uppercase tracking-wider">Planning Studio</p>
            </div>
          </div>
        </div>

        {/* Primary Action Button: + New Project */}
        <div className="p-3">
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-start text-xs font-semibold py-2"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => {
              onNewProject();
              if (onCloseMobile) onCloseMobile();
            }}
          >
            New Project
          </Button>
        </div>

        {/* Main Navigation */}
        <div className="px-2 py-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectNav(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-subtle cursor-pointer ${
                  isActive
                    ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                    : 'text-[#687280] hover:text-[#111827] hover:bg-[#F9FAFB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#111827]' : 'text-[#687280]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recent Projects List */}
        {projects.length > 0 && (
          <div className="mt-4 px-3">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider flex items-center justify-between">
              <span>Recent Plans</span>
              <span className="text-[10px] bg-[#F3F4F6] px-1.5 py-0.2 rounded">{projects.length}</span>
            </div>
            <div className="mt-1 space-y-0.5 max-h-48 overflow-y-auto pr-1">
              {projects.map((proj) => {
                const isSelected = proj.id === activeProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      if (onSelectProject) onSelectProject(proj.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs truncate transition-subtle flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#111827] text-white font-medium'
                        : 'text-[#374151] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    <ChevronRight
                      className={`w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ${
                        isSelected ? 'opacity-100 text-white' : 'text-[#9CA3AF]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer: User & Settings */}
      <div className="p-3 border-t border-[#E5E7EB] space-y-1 bg-[#FAFAFA]">
        <button
          onClick={() => {
            onSelectNav('settings');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-subtle cursor-pointer ${
            currentNav === 'settings'
              ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
              : 'text-[#687280] hover:text-[#111827] hover:bg-white'
          }`}
        >
          <Settings className="w-4 h-4 text-[#687280]" />
          <span>Settings</span>
        </button>

        {currentUser ? (
          <div className="pt-2 mt-1 border-t border-[#E5E7EB] flex items-center justify-between px-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-semibold shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[#111827] truncate">{currentUser.name}</p>
                <p className="text-[10px] text-[#687280] truncate">{currentUser.email}</p>
              </div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 text-[#687280] hover:text-[#DC2626] rounded-md hover:bg-white cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onSelectNav('auth')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#374151] hover:bg-white transition-subtle cursor-pointer"
          >
            <UserIcon className="w-4 h-4 text-[#687280]" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block h-full shrink-0">{sidebarContent}</div>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
