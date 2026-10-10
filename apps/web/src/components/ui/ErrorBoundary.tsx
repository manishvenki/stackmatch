import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home, Quote } from 'lucide-react';
import { getRotatingQuote } from '../../utils/quotes';
import { Button } from './Button';
import { StackMatchLogo } from '../brand/StackMatchLogo';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  quote: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    quote: getRotatingQuote('general'),
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      quote: getRotatingQuote('general'),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error.message, errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      quote: getRotatingQuote('general'),
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 sm:p-6 text-[#111827]">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#D1D5DB] shadow-xl p-6 sm:p-8 text-center space-y-5">
            <div className="flex justify-center mb-2">
              <StackMatchLogo variant="full" size="md" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] flex items-center justify-center mx-auto shadow-2xs">
              <AlertOctagon className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#111827] tracking-tight">
                {this.props.fallbackTitle || 'Something interrupted your workflow'}
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-2 leading-relaxed">
                {this.props.fallbackMessage ||
                  'An unexpected view issue occurred. Your project data is safely preserved. You can refresh or return to your planning studio.'}
              </p>
            </div>

            {/* Encouraging Quote */}
            <div className="p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-left flex items-start gap-2.5">
              <Quote className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5 opacity-80" />
              <p className="text-xs text-[#374151] font-medium italic leading-relaxed">
                “{this.state.quote}”
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto text-xs font-semibold"
              >
                Try Again
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReload}
                className="w-full sm:w-auto text-xs font-bold"
              >
                Reload Application
              </Button>
            </div>

            <button
              type="button"
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-1.5 text-xs text-[#687280] hover:text-[#111827] pt-2 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Planning Studio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
