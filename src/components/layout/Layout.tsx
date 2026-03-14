import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { PromotionCard } from "./PromotionCard";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      const desktop = window.innerWidth >= 1024;
      setIsMobile(mobile);
      setIsDesktop(desktop);

      // Auto-open sidebar on desktop
      if (desktop) {
        setSidebarOpen(true);
      }

      const updateViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        if (mobile && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.documentElement.style.setProperty(
            "--ios-vh",
            `${window.innerHeight}px`,
          );
        }
      };

      updateViewportHeight();
      setTimeout(updateViewportHeight, 100);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkScreenSize, 100);
    });

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("orientationchange", checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-muted/30">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={closeSidebar}
        onToggleCollapse={toggleSidebarCollapse}
      />

      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* Header with smooth hide on scroll */}
        <div className="flex-shrink-0 relative z-40 bg-card border-b border-border shadow-sm">
          <Header onToggleSidebar={toggleSidebar} isHidden={false} />
        </div>

        {/* Main content with page transitions */}
        <main className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto scroll-container bg-muted/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {isDashboard && (
          <div
            className="flex-shrink-0 bg-muted/30 border-t border-border w-full"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <PromotionCard />
          </div>
        )}
      </div>
    </div>
  );
};
