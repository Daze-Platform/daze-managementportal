import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DestinationProvider } from "./contexts/DestinationContext";
import { StoresProvider } from "./contexts/StoresContext";
import { EmployeesProvider } from "./contexts/EmployeesContext";
import { MenusProvider } from "./contexts/MenusContext";
import { PromotionsProvider } from "./contexts/PromotionsContext";
import { FilterProvider } from "./contexts/FilterContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import { LoadingScreen } from "./components/LoadingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Lazy load all page components for code-splitting
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
const Stores = lazy(() =>
  import("./pages/Stores").then((m) => ({ default: m.Stores })),
);
const ActiveOrders = lazy(() =>
  import("./pages/ActiveOrders").then((m) => ({ default: m.ActiveOrders })),
);
const OrderHistory = lazy(() =>
  import("./pages/OrderHistory").then((m) => ({ default: m.OrderHistory })),
);
const MenuManagement = lazy(() =>
  import("./pages/MenuManagement").then((m) => ({ default: m.MenuManagement })),
);
const Reports = lazy(() =>
  import("./pages/Reports").then((m) => ({ default: m.Reports })),
);
const Payouts = lazy(() =>
  import("./pages/Payouts").then((m) => ({ default: m.Payouts })),
);
const Employees = lazy(() =>
  import("./pages/Employees").then((m) => ({ default: m.Employees })),
);
const Ratings = lazy(() =>
  import("./pages/Ratings").then((m) => ({ default: m.Ratings })),
);
const Promotions = lazy(() =>
  import("./pages/Promotions").then((m) => ({ default: m.Promotions })),
);
const Settings = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.Settings })),
);
const Notifications = lazy(() =>
  import("./pages/Notifications").then((m) => ({ default: m.Notifications })),
);
const Couriers = lazy(() => import("./pages/Couriers"));
const DispatchLog = lazy(() => import("./pages/DispatchLog"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
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
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
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
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
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
        <Route
          path="/couriers"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Couriers />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dispatch-log"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <DispatchLog />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/index" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
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
                      <ErrorBoundary>
                        <AppRoutes />
                      </ErrorBoundary>
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
