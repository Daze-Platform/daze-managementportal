import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PromotionCard } from './PromotionCard';
import { useFullScreenScroll } from '@/hooks/useFullScreenScroll';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isScrollingDown } = useFullScreenScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      
      const updateViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        if (mobile && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.documentElement.style.setProperty('--ios-vh', `${window.innerHeight}px`);
        }
      };
      
      updateViewportHeight();
      setTimeout(updateViewportHeight, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100);
    });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/30">
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onClose={closeSidebar} 
        onToggleCollapse={toggleSidebarCollapse}
      />
      
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* Header with smooth hide on scroll */}
        <motion.div 
          className="flex-shrink-0 relative z-40 bg-card border-b border-border shadow-sm"
          initial={false}
          animate={{ 
            y: isScrollingDown && isMobile ? -100 : 0,
            opacity: isScrollingDown && isMobile ? 0 : 1
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Header onToggleSidebar={toggleSidebar} isHidden={false} />
        </motion.div>
        
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
          <div className="flex-shrink-0 bg-muted/30 border-t border-border">
            <PromotionCard />
          </div>
        )}
      </div>
    </div>
  );
};
