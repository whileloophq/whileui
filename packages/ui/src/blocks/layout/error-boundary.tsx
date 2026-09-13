import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './error-state';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback. If not provided, uses ErrorState. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Called when error is caught. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.reset);
      }
      if (fallback) {
        return fallback;
      }
      return <ErrorState error={error} onRetry={this.reset} retryLabel="Try again" />;
    }

    return children;
  }
}
