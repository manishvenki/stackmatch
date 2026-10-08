import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { User } from '../../types';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await api.register(name, email, password);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      // In offline mode or demo environment fallback:
      if (email === 'demo@stackmatch.dev') {
        const demoUser: User = {
          id: 'usr_demo_01',
          name: 'Alex Rivera',
          email: 'demo@stackmatch.dev',
          role: 'founder',
          createdAt: new Date().toISOString()
        };
        onAuthSuccess(demoUser);
        onClose();
      } else {
        setError(err.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('demo@stackmatch.dev');
    setPassword('password123');
    setName('Alex Rivera');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome to StackMatch' : 'Create your account'}
      description="Plan smarter. Choose better. Build with confidence."
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Toggle Mode */}
        <div className="flex border-b border-[#E5E7EB] pb-2 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`pb-1 border-b-2 transition-subtle cursor-pointer ${
              mode === 'login'
                ? 'border-[#111827] text-[#111827]'
                : 'border-transparent text-[#687280]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`pb-1 border-b-2 transition-subtle cursor-pointer ${
              mode === 'register'
                ? 'border-[#111827] text-[#111827]'
                : 'border-transparent text-[#687280]'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-xs text-[#DC2626]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <Input
              label="Full Name"
              type="text"
              required
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            required
            placeholder="founder@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full text-xs font-semibold"
              isLoading={isLoading}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full text-xs text-[#687280]"
              onClick={handleUseDemo}
            >
              Prefill Demo Account (demo@stackmatch.dev)
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
