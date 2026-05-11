import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
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

  // Role-gated routes: wait for the profile to load before deciding.
  // userProfile is hydrated asynchronously after isAuthenticated flips true,
  // and a missing role would otherwise bounce the user before their role arrives.
  // "owner" always satisfies any role gate — it's the top of the hierarchy.
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userProfile) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading…</p>
          </div>
        </div>
      );
    }
    const userRole = userProfile.role;
    if (!userRole || (userRole !== "owner" && !allowedRoles.includes(userRole))) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
