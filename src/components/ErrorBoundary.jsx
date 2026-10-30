import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Web3 / React Component Error Boundary caught exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (window.location.hash) {
      window.location.hash = '#dashboard';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050811] text-gray-100 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
          <div className="max-w-xl w-full rounded-3xl bg-gray-900/90 border border-rose-500/30 p-8 shadow-2xl backdrop-blur-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                Application Exception Handled
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-3 tracking-tight">
                Portal Encountered an Unexpected State
              </h1>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                An unhandled error occurred during application execution or Web3 transaction handling. The exception was isolated to prevent an unhandled crash.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-2xl bg-black/60 border border-gray-800 text-left overflow-auto max-h-40">
                <p className="text-xs font-mono font-semibold text-rose-300 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleResetState}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold text-xs border border-gray-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Portal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
