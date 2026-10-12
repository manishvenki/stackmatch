import React from 'react';
import {
  PlusCircle,
  LayoutDashboard,
  MessageSquare,
  Layers,
  FileText,
  Users,
  Settings,
  ChevronRight,
  LogOut,
  User as UserIcon,
  FolderKanban,
  X,
  BookOpen,
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Discussion Studio', icon: MessageSquare },
    { id: 'overview', label: 'Project Plan Overview', icon: Layers },
    { id: 'projects', label: 'Saved Projects', icon: FolderKanban },
    { id: 'blueprint', label: 'Blueprint', icon: FileText },
    { id: 'resources', label: 'Developer Resources', icon: BookOpen },
    { id: 'connect', label: 'Connect with Freelancers', icon: Users, isComingSoon: true },
  ];

  const sidebarContent = (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] h-full flex flex-col justify-between select-none">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Workspace Identity Marker (No duplicate StackMatch full logo) */}
        <div className="h-16 px-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              SM
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#111827] tracking-tight leading-none">
                Planning Studio
              </span>
              <span className="text-[10px] text-[#687280] leading-none mt-1">
                Workspace Menu
              </span>
            </div>
          </div>
          {isOpenMobile && onCloseMobile ? (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-[#687280] hover:text-[#111827] rounded-md cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <span className="text-[9px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Active
            </span>
          )}
        </div>

        {/* Primary Action Button: + New Project Plan */}
        <div className="p-3 shrink-0">
          <Button
            variant="accent"
            size="sm"
            className="w-full justify-start text-xs font-semibold h-9 shadow-xs"
            leftIcon={<PlusCircle className="w-4 h-4 text-white" />}
            onClick={() => {
              onNewProject();
              if (onCloseMobile) onCloseMobile();
            }}
          >
            New Project Plan
          </Button>
        </div>

        {/* Main Navigation Group */}
        <div className="px-2 py-1 space-y-0.5 shrink-0">
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
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-subtle cursor-pointer ${
                  isActive
                    ? 'bg-[#111827] text-white font-semibold shadow-xs'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#687280]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isComingSoon && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0 ml-1.5 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                    }`}
                  >
                    SOON
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Projects List */}
        {projects.length > 0 && (
          <div className="mt-4 px-3 flex-1 min-h-0 flex flex-col">
            <div className="px-2 py-1 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <FolderKanban className="w-3 h-3 text-[#9CA3AF]" />
                <span>Active Plans</span>
              </span>
              <span className="text-[10px] bg-[#F3F4F6] text-[#374151] px-1.5 py-0.2 rounded font-semibold">
                {projects.length}
              </span>
            </div>
            <div className="mt-1 space-y-0.5 overflow-y-auto pr-1 flex-1">
              {projects.map((proj) => {
                const isSelected = proj.id === activeProjectId;
                return (
                  <button
                    key={proj.id}
                    onClick={() => {
                      if (onSelectProject) onSelectProject(proj.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs truncate transition-subtle flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-[#F3F4F6] text-[#111827] font-bold border-l-2 border-[#111827]'
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
      <div className="p-3 border-t border-[#E5E7EB] space-y-1 bg-[#FAFAFA] shrink-0">
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
                aria-label="Sign out"
                className="p-1.5 text-[#687280] hover:text-[#DC2626] rounded-md hover:bg-white cursor-pointer transition-subtle"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              onSelectNav('auth');
              if (onCloseMobile) onCloseMobile();
            }}
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
