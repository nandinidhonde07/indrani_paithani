import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught runtime exception:", error, errorInfo);
  }

  handleReload = () => {
    localStorage.clear(); // Clear potentially corrupted storage
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center font-body">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gold/30 space-y-4">
            <div className="w-16 h-16 bg-maroon/10 text-maroon rounded-full flex items-center justify-center mx-auto text-2xl">✨</div>
            <h1 className="text-2xl font-heading text-maroon font-bold">Indrani Paithani</h1>
            <p className="text-sm text-gray-600 font-light">
              We encountered a temporary rendering issue. Please click below to refresh and restore your store experience.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full bg-maroon hover:bg-gold text-white font-bold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition shadow-md"
            >
              Restore & Reload Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
