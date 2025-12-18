import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';

export const Sidebar = ({ 
  isOpen = true, 
  isCollapsed = false, 
  onClose, 
  onToggleCollapse 
}: { 
  isOpen?: boolean; 
  isCollapsed?: boolean; 
  onClose?: () => void; 
  onToggleCollapse?: () => void; 
}) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  // On desktop, sidebar is always visible
  const shouldShow = isDesktop || isOpen;

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-foreground/30 backdrop-blur-sm z-40" 
            onClick={onClose} 
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.div 
        className={`
          fixed lg:static top-0 left-0 z-50 lg:z-auto
          text-sidebar-foreground h-screen flex flex-col
          border-r border-sidebar-border/30 shadow-xl lg:shadow-none
          ${isCollapsed ? 'w-16' : 'w-64 sm:w-72 md:w-80 lg:w-64 xl:w-72'}
        `}
        initial={false}
        animate={{ 
          x: shouldShow ? 0 : '-100%',
          width: isCollapsed ? 64 : undefined 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          x: { duration: 0.3 }
        }}
        style={{ backgroundColor: 'hsl(222, 47%, 11%)' }}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        
        <SidebarHeader 
          isOpen={isOpen} 
          isCollapsed={isCollapsed} 
          onClose={onClose} 
          onToggleCollapse={onToggleCollapse} 
        />

        <SidebarNavigation
          expandedItems={expandedItems}
          onToggleSubmenu={toggleSubmenu}
          onClose={onClose}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
        
        {/* Footer spacer */}
        <div className="flex-shrink-0 h-4 sm:h-6" />
      </motion.div>
    </>
  );
};
