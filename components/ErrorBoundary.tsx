import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 text-center max-w-md">
                <div className="text-7xl mb-4">💥</div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    Oops! Something went wrong.
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    An unexpected error occurred. You can try to recover by clicking the button below.
                </p>
                <button
                    onClick={this.handleRetry}
                    className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
                >
                    Try Again 🔄
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;