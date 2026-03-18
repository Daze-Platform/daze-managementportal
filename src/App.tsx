import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DestinationProvider } from "./contexts/DestinationContext";
import { StoresProvider } from "./contexts/StoresContext";
import { EmployeesProvider } from "./contexts/EmployeesContext";
import { MenusProvider } from "./contexts/MenusContext";
import { PromotionsProvider } from "./contexts/PromotionsContext";
import { FilterProvider } from "./contexts/FilterContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Stores } from "./pages/Stores";
import { ActiveOrders } from "./pages/ActiveOrders";
import { OrderHistory } from "./pages/OrderHistory";
import { MenuManagement } from "./pages/MenuManagement";
import { Reports } from "./pages/Reports";
import { Payouts } from "./pages/Payouts";
import { Employees } from "./pages/Employees";
import { Users } from "./pages/Users";
import { Ratings } from "./pages/Ratings";
import { Promotions } from "./pages/Promotions";
import { Settings } from "./pages/Settings";
import { Notifications } from "./pages/Notifications";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AcceptInvite from "./pages/AcceptInvite";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/venues"
        element={
          <ProtectedRoute>
            <Layout>
              <Stores />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/stores" element={<Navigate to="/venues" replace />} />
      <Route
        path="/orders/active"
        element={
          <ProtectedRoute>
            <Layout>
              <ActiveOrders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/history"
        element={
          <ProtectedRoute>
            <Layout>
              <OrderHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/menus"
        element={
          <ProtectedRoute>
            <Layout>
              <MenuManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/financials"
        element={
          <ProtectedRoute>
            <Layout>
              <Payouts />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <Layout>
              <Employees />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ratings"
        element={
          <ProtectedRoute>
            <Layout>
              <Ratings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/promotions"
        element={
          <ProtectedRoute>
            <Layout>
              <Promotions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/index" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DestinationProvider>
          <StoresProvider>
            <EmployeesProvider>
              <MenusProvider>
                <PromotionsProvider>
                  <FilterProvider>
                    <BrowserRouter>
                      <AppRoutes />
                    </BrowserRouter>
                  </FilterProvider>
                </PromotionsProvider>
              </MenusProvider>
            </EmployeesProvider>
          </StoresProvider>
        </DestinationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
