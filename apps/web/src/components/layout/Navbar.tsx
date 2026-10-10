import React, { useState } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  User as UserIcon,
  Plus,
  Compass,
  ExternalLink,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { User } from '../../types';
import { StackMatchLogo } from '../brand/StackMatchLogo';

export interface NavbarProps {
  currentUser?: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate: (view: string) => void;
  currentView: string;
  isWorkspace?: boolean;
  activeProjectName?: string;
  onNewProject?: () => void;
  onLogout?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onNavigate,
  currentView,
  isWorkspace = false,
  activeProjectName,
  onNewProject,
  onLogout,
  onToggleMobileSidebar,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Section: Single Brand Identity + Contextual Workspace Marker */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Hamburger (Workspace View) */}
          {isWorkspace && onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 -ml-1 text-[#687280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-subtle cursor-pointer"
              aria-label="Toggle workspace navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Primary Global Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center group cursor-pointer focus:outline-none"
            aria-label="StackMatch Home"
          >
            <StackMatchLogo variant="full" size="md" />
          </button>

          {/* Workspace Studio Indicator & Breadcrumb */}
          {isWorkspace && (
            <div className="hidden sm:flex items-center gap-2 pl-3 ml-2 border-l border-[#E5E7EB]">
              <span className="text-[10px] font-bold text-[#111827] bg-[#F3F4F6] px-2 py-0.5 rounded tracking-wide uppercase">
                Studio
              </span>
              {activeProjectName && (
                <>
                  <span className="text-[#D1D5DB] text-xs">/</span>
                  <span className="text-xs font-semibold text-[#4B5563] truncate max-w-[180px] md:max-w-[280px]">
                    {activeProjectName}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Center Section: Public Marketing Navigation (Shown only on Public Pages) */}
        {!isWorkspace ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#687280]">
            <button
              onClick={() => onNavigate('features')}
              className={`transition-subtle hover:text-[#111827] cursor-pointer py-1 ${
                currentView === 'features' ? 'text-[#111827] font-semibold' : ''
              }`}
            >
              Features
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className={`transition-subtle hover:text-[#111827] cursor-pointer py-1 ${
                currentView === 'how-it-works' ? 'text-[#111827] font-semibold' : ''
              }`}
            >
              How it works
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className={`transition-subtle hover:text-[#111827] cursor-pointer py-1 ${
                currentView === 'resources' ? 'text-[#111827] font-semibold' : ''
              }`}
            >
              Resources
            </button>
            <button
              onClick={() => onNavigate('connect')}
              className={`transition-subtle hover:text-[#111827] cursor-pointer py-1 flex items-center gap-1.5 ${
                currentView === 'connect' ? 'text-[#111827] font-semibold' : ''
              }`}
            >
              <span>Connect</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                SOON
              </span>
            </button>
            <button
              onClick={() => onNavigate('workspace')}
              className={`transition-subtle hover:text-[#111827] cursor-pointer py-1 ${
                currentView === 'workspace' ? 'text-[#111827] font-semibold' : ''
              }`}
            >
              Workspace
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            {/* Contextual Workspace Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#F9FAFB] rounded-full border border-[#E5E7EB] text-xs text-[#687280]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="font-medium text-[#374151]">Planning Intelligence Active</span>
            </div>
          </div>
        )}

        {/* Right Section: Actions & User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {isWorkspace ? (
            /* Workspace Actions */
            <div className="flex items-center gap-3">
              {onNewProject && (
                <Button
                  variant="accent"
                  size="sm"
                  onClick={onNewProject}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="h-8 text-xs font-semibold shadow-2xs"
                >
                  New Project Plan
                </Button>
              )}

              {/* User Account Capsule */}
              {currentUser && (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-subtle cursor-pointer border border-[#E5E7EB]"
                    aria-label="User menu"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center text-[11px] font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-[#111827] max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-[#687280]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E5E7EB] py-1 z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-[#F3F4F6]">
                        <p className="text-xs font-bold text-[#111827] truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-[#687280] truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('settings');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#374151] hover:bg-[#F9FAFB] cursor-pointer"
                      >
                        Workspace Settings
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('landing');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-[#687280] hover:bg-[#F9FAFB] cursor-pointer"
                      >
                        Marketing Site
                      </button>
                      {onLogout && (
                        <button
                          onClick={() => {
                            onLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-[#DC2626] hover:bg-[#FEF2F2] border-t border-[#F3F4F6] cursor-pointer flex items-center gap-1.5"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Public Marketing Actions */
            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#374151] bg-[#F3F4F6] px-2.5 py-1.5 rounded-full border border-[#E5E7EB]">
                    <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="truncate max-w-[110px]">{currentUser.name}</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onNavigate('workspace')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="h-8 text-xs font-bold shadow-xs"
                  >
                    Go to Workspace
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenAuth('login')}
                    className="h-8 text-xs font-semibold text-[#374151]"
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenAuth('register')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="h-8 text-xs font-bold shadow-xs"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Controls Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {!isWorkspace && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#687280] hover:text-[#111827] rounded-lg cursor-pointer"
              aria-label="Toggle mobile marketing menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}

          {isWorkspace && onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="p-2 text-[#687280] hover:text-[#111827] rounded-lg cursor-pointer"
              aria-label="Toggle workspace navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Public Marketing Navigation) */}
      {!isWorkspace && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-1.5 text-sm font-medium text-[#374151]">
            <button
              onClick={() => {
                onNavigate('features');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => {
                onNavigate('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => {
                onNavigate('resources');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6] cursor-pointer"
            >
              Resources
            </button>
            <button
              onClick={() => {
                onNavigate('connect');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6] flex items-center justify-between cursor-pointer"
            >
              <span>Connect with Freelancers</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                SOON
              </span>
            </button>
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6] font-semibold text-[#111827] cursor-pointer"
            >
              Workspace
            </button>
          </nav>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="primary"
                size="md"
                className="w-full text-xs font-bold"
                onClick={() => {
                  onNavigate('workspace');
                  setMobileMenuOpen(false);
                }}
              >
                Go to Workspace
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full text-xs font-semibold"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-bold"
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
