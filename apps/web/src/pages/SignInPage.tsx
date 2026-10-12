import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, CheckCircle2, FileText, Bot } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { User } from '../types';
import { api } from '../services/api';

export interface SignInPageProps {
  onSuccess: (user: User) => void;
  onNavigateSignUp: () => void;
  onNavigateHome: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({
  onSuccess,
  onNavigateSignUp,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-[#111827]">
      {/* Clean Form Side (Desktop Left - Opposite from Sign-Up) */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile Top Brand Bar */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <button onClick={onNavigateHome} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#111827] text-white flex items-center justify-center font-bold text-xs">
                SM
              </div>
              <span className="font-extrabold text-sm text-[#111827]">StackMatch</span>
            </button>
            <button
              onClick={onNavigateSignUp}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Create Account
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Sign in to StackMatch
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Welcome back. Enter your credentials to access your projects and blueprints.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#DC2626] animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{error}</span>
                {error.toLowerCase().includes('sign up first') && (
                  <button
                    type="button"
                    onClick={onNavigateSignUp}
                    className="block mt-1.5 font-bold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Click here to create a new account →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#374151]">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full justify-center text-sm font-bold h-11 mt-2 shadow-xs cursor-pointer"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Workspace
            </Button>
          </form>

          {/* Switch to Sign Up */}
          <div className="pt-4 border-t border-[#F3F4F6] text-center text-xs text-[#4B5563]">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              Create an account →
            </button>
          </div>
        </div>
      </div>

      {/* Visual Brand Artwork Side (Desktop Right - Opposite from Sign-Up) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Header & Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-white text-[#111827] flex items-center justify-center font-black text-sm tracking-tighter shadow-md">
              SM
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight block text-white group-hover:text-blue-400 transition-colors">
                StackMatch
              </span>
              <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase block font-semibold">
                Planning Studio
              </span>
            </div>
          </button>
          <span className="text-xs text-[#9CA3AF] bg-[#1F2937] px-3 py-1 rounded-full border border-[#374151]">
            Encrypted Session
          </span>
        </div>

        {/* Product Spec Card Preview Artwork */}
        <div className="relative z-10 my-auto py-8 max-w-lg space-y-6">
          <div className="p-6 rounded-2xl bg-[#1F2937] border border-[#374151] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#374151] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Planning Studio
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#9CA3AF] bg-[#111827] px-2 py-0.5 rounded">
                Dynamic Spec
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Full Architectural Synthesis</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Connect your product ideas directly with live Google AI planning intelligence, MongoDB persistence, and multi-tier roadmap visualization.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#374151] flex items-center gap-2 text-xs">
                <Bot className="w-4 h-4 text-[#60A5FA]" />
                <span className="font-semibold text-white">Google Gemini</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#111827] border border-[#374151] flex items-center gap-2 text-xs">
                <FileText className="w-4 h-4 text-[#34D399]" />
                <span className="font-semibold text-white">Dynamic Blueprint</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[#9CA3AF] italic">
              "StackMatch bridges the gap between raw business ideas and unambiguous engineering architecture."
            </p>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-6 border-t border-[#1F2937] text-xs text-[#6B7280]">
          <p className="font-medium text-[#9CA3AF]">
            Plan smarter. Choose better. Build with confidence.
          </p>
        </div>
      </div>
    </div>
  );
};
