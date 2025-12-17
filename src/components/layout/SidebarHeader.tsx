
import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarHeaderProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export const SidebarHeader = ({ isOpen, isCollapsed = false, onClose, onToggleCollapse }: SidebarHeaderProps) => {
  return (
    <>
      {/* Mobile/Tablet Close Button */}
      <div className="lg:hidden absolute top-2 right-4 z-10">
        <button 
          onClick={onClose} 
          className="p-1.5 text-white hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
          aria-label="Close sidebar"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

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
          /* Expanded State - Daze Logo + Arrow */
          <div className="flex items-center justify-between">
            <div className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
              <img 
                src="/lovable-uploads/db847939-b95d-4615-ab8d-a03ec8f81e50.png" 
                alt="Daze Logo" 
                className="h-4 sm:h-5 md:h-6 w-auto object-contain"
              />
            </div>
            
            <div className="hidden lg:flex items-center justify-center">
              <button
                onClick={onToggleCollapse}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
