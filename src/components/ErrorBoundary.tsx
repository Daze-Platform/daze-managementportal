import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled render error:", error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleHome = () => {
    window.location.assign("/dashboard");
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6">
        <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-pop p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/10 text-destructive mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold text-foreground text-center mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            The page hit an unexpected error. Reloading usually fixes it. If it
            keeps happening, let the team know.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={this.handleHome}>
              Go to dashboard
            </Button>
            <Button className="flex-1" onClick={this.handleReload}>
              Reload
            </Button>
          </div>
          {import.meta.env.DEV && (
            <details className="mt-6 text-xs text-muted-foreground">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }
}
