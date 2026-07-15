import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userProfile } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role-gated routes. Resolve the user's role from React state first, then
  // fall back to the cached profile in localStorage so navigation doesn't block
  // on a slow/in-flight profile fetch. "owner" is the top of the hierarchy
  // and satisfies any role gate.
  if (allowedRoles && allowedRoles.length > 0) {
    let userRole = userProfile?.role;
    if (!userRole) {
      try {
        const cached = localStorage.getItem("userProfile");
        if (cached) userRole = JSON.parse(cached)?.role;
      } catch {
        /* ignore cache miss */
      }
    }
    if (
      !userRole ||
      (userRole !== "owner" && !allowedRoles.includes(userRole))
    ) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
