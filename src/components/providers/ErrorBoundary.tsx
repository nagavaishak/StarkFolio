"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-[#080b14] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <p className="text-orange-400 text-lg font-bold mb-2">StarkFolio</p>
            <p className="text-gray-400 text-sm mb-2">
              Initialization error:
            </p>
            <pre className="text-xs text-red-400 bg-red-900/20 p-3 rounded mb-4 text-left max-w-sm overflow-auto">
              {this.state.error?.message || "unknown"}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-400"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
