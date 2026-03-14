import React from "react";
import { X, PanelLeftClose, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  isOpen: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

export const SidebarHeader = ({
  isOpen,
  isCollapsed = false,
  onClose,
  onToggleCollapse,
}: SidebarHeaderProps) => {
  return (
    <>
      {/* Logo Section */}
      <div
        className={`flex-shrink-0 ${isCollapsed ? "p-1.5" : "p-4 sm:p-5 md:p-7"}`}
      >
        {isCollapsed ? (
          /* Collapsed State - Cloud Logo with Hover Chevron */
          <div className="flex items-center justify-center w-full h-16">
            <button
              className="relative flex items-center justify-center hover:bg-white/10 active:bg-white/15 active:scale-95 transition-all duration-200 cursor-pointer rounded-xl p-2 group"
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
            >
              {/* D Logo - wrapped in white rounded container for visibility on dark bg */}
              <div className="bg-white rounded-lg p-1 transition-opacity duration-200 lg:group-hover:opacity-0">
                <img
                  src="/daze-logo-d2.png"
                  alt="DAZE Logo"
                  className="h-5 w-auto object-contain"
                />
              </div>

              {/* Chevron - hidden by default, appears on hover (desktop only) */}
              <ChevronRight className="absolute w-5 h-5 text-white/70 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        ) : (
          /* Expanded State - DAZE Logo + Controls */
          <div className="flex items-center justify-between gap-2">
            <div className="transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center gap-2 flex-shrink-0">
              <div className="bg-white rounded-lg p-1">
                <img
                  src="/daze-logo-d2.png"
                  alt="DAZE Logo"
                  className="h-5 sm:h-6 md:h-7 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-extrabold tracking-widest text-sm sm:text-[15px] bg-gradient-to-r from-white via-blue-100 to-white/80 bg-clip-text text-transparent">
                  DAZE
                </span>
                <span className="text-white/40 text-[8px] tracking-[0.18em] font-medium uppercase">
                  Management Hub
                </span>
              </div>
            </div>

            {/* Controls container */}
            <div className="flex items-center gap-1">
              {/* Desktop Collapse Button */}
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 items-center justify-center"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="w-5 h-5" strokeWidth={2} />
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
