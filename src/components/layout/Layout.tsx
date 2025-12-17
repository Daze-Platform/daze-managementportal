
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Sidebar - positioned to not interfere with header */}
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onClose={closeSidebar} 
        onToggleCollapse={toggleSidebarCollapse}
      />
      
      {/* Main content area - properly positioned to avoid overlap */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* Header with proper z-index and positioning */}
        <div className={`flex-shrink-0 relative z-40 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ${
          isScrollingDown && isMobile ? 'transform -translate-y-full opacity-0' : 'transform translate-y-0 opacity-100'
        }`}>
          <Header 
            onToggleSidebar={toggleSidebar} 
            isHidden={false}
          />
        </div>
        
        {/* Main content with proper spacing */}
        <main className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto bg-gray-50">
            {children}
          </div>
        </main>
        
        {/* Static promotion card integrated into dashboard flow */}
        {isDashboard && (
          <div className="flex-shrink-0 bg-gray-50 border-t border-gray-100">
            <PromotionCard />
          </div>
        )}
      </div>
    </div>
  );
};
