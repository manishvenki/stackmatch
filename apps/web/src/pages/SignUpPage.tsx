import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, ArrowRight, Sparkles, Shield, Layers, FileCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { User } from '../types';
import { api } from '../services/api';

export interface SignUpPageProps {
  onSuccess: (user: User) => void;
  onNavigateSignIn: () => void;
  onNavigateHome: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({
  onSuccess,
  onNavigateSignIn,
  onNavigateHome,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation rules
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!hasMinLength) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.register({
        name: name.trim(),
        username: username.trim() || name.trim().toLowerCase().replace(/\s+/g, '_'),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
      });

      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed. An account with this email may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-[#111827]">
      {/* Visual Brand Artwork Side (Desktop Left) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#111827] text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden select-none">
        {/* Subtle geometric grid background pattern */}
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
            v2.0 Release
          </span>
        </div>

        {/* Hero Narrative & Features */}
        <div className="relative z-10 my-auto py-12 max-w-lg space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#60A5FA] bg-[#1E3A8A]/40 px-3 py-1 rounded-full border border-[#1E40AF]">
              Architectural Planning Platform
            </span>
            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight">
              Turn your concept into a build-ready engineering specification.
            </h1>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Define requirements, compare technology trade-offs, design system architecture, and generate comprehensive project blueprints with AI assistance.
            </p>
          </div>

          {/* Benefit Highlights */}
          <div className="space-y-4 pt-2">
            {[
              { icon: Sparkles, text: 'AI scoping conversation tailored to your background' },
              { icon: Layers, text: 'Curated technology recommendations with trade-off analysis' },
              { icon: FileCheck, text: 'Exportable blueprints with authentic technology logos & checklists' },
              { icon: Shield, text: 'Private project ownership and MongoDB cloud persistence' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs text-[#E5E7EB]">
                  <div className="w-6 h-6 rounded-md bg-[#1F2937] border border-[#374151] flex items-center justify-center text-[#60A5FA] shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-6 border-t border-[#1F2937] text-xs text-[#6B7280]">
          <p className="font-medium text-[#9CA3AF]">
            Plan smarter. Choose better. Build with confidence.
          </p>
        </div>
      </div>

      {/* Clean Form Side (Desktop Right) */}
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
              onClick={onNavigateSignIn}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Sign In
            </button>
          </div>

          {/* Form Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Start planning your next software project with AI intelligence.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-xs text-[#DC2626] animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Full Name <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Username <span className="text-[#9CA3AF] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. mayachen"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Email Address <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                Confirm Password <span className="text-[#DC2626]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-[#D1D5DB] text-sm text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirement Indicators */}
            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-1 text-[11px] text-[#4B5563]">
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-[#16A34A]' : 'text-[#D1D5DB]'}`} />
                <span className={hasMinLength ? 'text-[#16A34A] font-semibold' : ''}>
                  Minimum 6 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className={`w-3.5 h-3.5 ${passwordsMatch ? 'text-[#16A34A]' : 'text-[#D1D5DB]'}`} />
                <span className={passwordsMatch ? 'text-[#16A34A] font-semibold' : ''}>
                  Passwords match
                </span>
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
              Create Account & Start Planning
            </Button>
          </form>

          {/* Switch to Sign In */}
          <div className="pt-4 border-t border-[#F3F4F6] text-center text-xs text-[#4B5563]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateSignIn}
              className="font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              Sign in to your workspace →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
