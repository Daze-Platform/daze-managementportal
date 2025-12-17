
import React from 'react';
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

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <>
      {/* Mobile/Tablet Overlay - Covers entire screen on smaller devices */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar - Full viewport height on all devices */}
      <div className={`
        fixed lg:static top-0 left-0 z-50 lg:z-auto
        text-white h-screen flex flex-col
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        border-r border-blue-800/30 shadow-xl lg:shadow-none
        ${isCollapsed ? 'w-16' : 'w-64 sm:w-72 md:w-80 lg:w-64 xl:w-72'}
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{ backgroundColor: '#021945' }}>
        
        <SidebarHeader isOpen={isOpen} isCollapsed={isCollapsed} onClose={onClose} onToggleCollapse={onToggleCollapse} />

        <SidebarNavigation
          expandedItems={expandedItems}
          onToggleSubmenu={toggleSubmenu}
          onClose={onClose}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
        
        {/* Footer spacer to ensure content doesn't get cut off */}
        <div className="flex-shrink-0 h-4 sm:h-6"></div>
      </div>
    </>
  );
};
