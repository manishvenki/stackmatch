import React, { useState } from 'react';
import { Layers, Menu, X, ArrowRight, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { User } from '../../types';

export interface NavbarProps {
  currentUser?: User | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onNavigate: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onNavigate,
  currentView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold shadow-xs transition-subtle group-hover:scale-105">
            <Layers className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <span className="text-base font-bold text-[#111827] tracking-tight">StackMatch</span>
          </div>
        </button>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#687280]">
          <button
            onClick={() => onNavigate('features')}
            className={`transition-subtle hover:text-[#111827] cursor-pointer ${
              currentView === 'features' ? 'text-[#111827]' : ''
            }`}
          >
            Features
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`transition-subtle hover:text-[#111827] cursor-pointer ${
              currentView === 'how-it-works' ? 'text-[#111827]' : ''
            }`}
          >
            How it works
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className={`transition-subtle hover:text-[#111827] cursor-pointer ${
              currentView === 'resources' ? 'text-[#111827]' : ''
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className={`transition-subtle hover:text-[#111827] cursor-pointer ${
              currentView === 'workspace' ? 'text-[#111827]' : ''
            }`}
          >
            Workspace
          </button>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('workspace')}
                className="flex items-center gap-2 text-xs font-medium text-[#374151] bg-[#F3F4F6] px-3 py-1.5 rounded-full hover:bg-[#E5E7EB] transition-subtle cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-[10px]">
                  <UserIcon className="w-3 h-3" />
                </div>
                <span>{currentUser.name}</span>
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigate('chat')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Go to Workspace
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => onOpenAuth('login')}>
                Sign in
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth('register')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#687280] hover:text-[#111827] rounded-lg cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
            <button
              onClick={() => {
                onNavigate('features');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6]"
            >
              Features
            </button>
            <button
              onClick={() => {
                onNavigate('how-it-works');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6]"
            >
              How it works
            </button>
            <button
              onClick={() => {
                onNavigate('resources');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6]"
            >
              Resources
            </button>
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left rounded-lg hover:bg-[#F3F4F6]"
            >
              Workspace
            </button>
          </nav>
          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  onNavigate('workspace');
                  setMobileMenuOpen(false);
                }}
              >
                Enter Workspace
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full"
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
                  className="w-full"
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
