import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log the error for debugging
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo);

    // Check if it's an object rendering error
    if (error.message?.includes('Objects are not valid as a React child')) {
      console.error('🔧 Object Rendering Error Detected:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });

      // Extract object keys from error message for debugging
      const objectKeysMatch = error.message.match(/found: object with keys \{([^}]+)\}/);
      if (objectKeysMatch) {
        console.error('🔧 Problematic object keys:', objectKeysMatch[1]);
        console.error('💡 Fix: Ensure these object properties are handled in SafeStrategyValue or SafeContent components');
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 m-2">
          <h3 className="text-red-400 font-semibold mb-2">⚠️ Display Error</h3>
          <p className="text-slate-300 text-sm mb-3">
            Something went wrong while displaying this content.
          </p>
          {import.meta.env.DEV && (
            <details className="text-xs text-slate-400">
              <summary className="cursor-pointer mb-2">Debug Information</summary>
              <pre className="bg-slate-800 p-2 rounded text-xs overflow-auto">
                {this.state.error?.message}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            className="px-3 py-1 bg-red-600/50 hover:bg-red-600/70 text-red-200 rounded text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
