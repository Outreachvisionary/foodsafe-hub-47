
import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: error.stack || null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Log to external service if configured
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // Here you could send errors to a service like Sentry, LogRocket, etc.
    // For now, we'll just log to console
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.error('Error logged:', errorData);
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isAuthError = this.state.error?.message?.toLowerCase().includes('auth') ||
                         this.state.error?.message?.toLowerCase().includes('session') ||
                         this.state.error?.message?.toLowerCase().includes('token');

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl">
                {isAuthError ? 'Authentication Error' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {isAuthError 
                  ? 'There was a problem with your authentication session.'
                  : 'An unexpected error occurred. Please try again.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <div className="p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-auto">
                  <strong>Error:</strong> {this.state.error?.message}
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">Stack trace</summary>
                      <pre className="mt-1 whitespace-pre-wrap">{this.state.errorInfo}</pre>
                    </details>
                  )}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleRetry} variant="outline" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} className="flex-1">
                  Reload Page
                </Button>
              </div>

              {isAuthError && (
                <div className="pt-2 border-t">
                  <Button 
                    variant="link" 
                    className="w-full text-sm"
                    onClick={() => {
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.href = '/auth';
                    }}
                  >
                    Clear session and restart
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
