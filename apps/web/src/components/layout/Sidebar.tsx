import React from 'react';
import {
  PlusCircle,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Layers,
  BookOpen,
  Settings,
  ChevronRight,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { User, Project } from '../../types';
import { StackMatchLogo } from '../brand/StackMatchLogo';

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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Discussion Studio', icon: MessageSquare },
    { id: 'overview', label: 'Project Plan Overview', icon: Layers },
    { id: 'resources', label: 'Learning Resources', icon: BookOpen },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] h-full flex flex-col justify-between select-none">
      <div>
        {/* Workspace Brand / Header */}
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <StackMatchLogo variant="full" size="md" />
        </div>

        {/* Primary Action Button: + New Project */}
        <div className="p-3">
          <Button
            variant="accent"
            size="sm"
            className="w-full justify-start text-xs font-semibold py-2"
            leftIcon={<PlusCircle className="w-4 h-4 text-white" />}
            onClick={() => {
              onNewProject();
              if (onCloseMobile) onCloseMobile();
            }}
          >
            New Project Plan
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
                    ? 'bg-[#111827] text-white font-semibold shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#687280]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Recent Projects List */}
        {projects.length > 0 && (
          <div className="mt-4 px-3">
            <div className="px-2 py-1 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center justify-between">
              <span>Active Plans</span>
              <span className="text-[10px] bg-[#F3F4F6] text-[#374151] px-1.5 py-0.2 rounded font-semibold">{projects.length}</span>
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs truncate transition-subtle flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#F3F4F6] text-[#111827] font-bold'
                        : 'text-[#4B5563] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    <span className="truncate">{proj.name}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected ? 'text-[#111827] translate-x-0.5' : 'text-[#D1D5DB] group-hover:text-[#687280]'
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
              ? 'bg-[#111827] text-white font-semibold'
              : 'text-[#687280] hover:text-[#111827] hover:bg-white'
          }`}
        >
          <Settings className="w-4 h-4 text-[#687280]" />
          <span>Workspace Settings</span>
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

export default Sidebar;
