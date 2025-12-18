
import React from 'react';
import { X, ChevronLeft } from 'lucide-react';

interface SidebarHeaderProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export const SidebarHeader = ({ isOpen, isCollapsed = false, onClose, onToggleCollapse }: SidebarHeaderProps) => {
  return (
    <>
      {/* Logo Section */}
      <div className={`flex-shrink-0 border-b border-white/10 ${isCollapsed ? 'p-1' : 'p-4 sm:p-5 md:p-6'}`}>
        {isCollapsed ? (
          /* Collapsed State - Only Cloud Logo */
          <div className="flex items-center justify-center w-full h-16">
            <div 
              className="flex items-center justify-center hover:bg-white/8 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer rounded-lg"
              onClick={onToggleCollapse}
              style={{ 
                width: '56px', 
                height: '56px',
                minWidth: '56px',
                minHeight: '56px'
              }}
            >
              <img 
                src="/lovable-uploads/314bc76d-4c76-4519-b8cd-5e3c08d90fe6.png" 
                alt="App Logo" 
                className="hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] object-contain"
                style={{ 
                  width: '48px', 
                  height: '48px',
                  minWidth: '48px',
                  minHeight: '48px'
                }}
              />
            </div>
          </div>
        ) : (
          /* Expanded State - DAZE Logo + Controls */
          <div className="flex items-center justify-between gap-2">
            <div className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex-shrink-0">
              <img 
                src="/lovable-uploads/db847939-b95d-4615-ab8d-a03ec8f81e50.png" 
                alt="DAZE Logo" 
                className="h-4 sm:h-5 md:h-6 w-auto object-contain"
              />
            </div>
            
            {/* Controls container */}
            <div className="flex items-center gap-1">
              {/* Desktop Collapse Button */}
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] items-center justify-center"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              
              {/* Mobile/Tablet Close Button */}
              <button 
                onClick={onClose} 
                className="lg:hidden p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors flex items-center justify-center"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
