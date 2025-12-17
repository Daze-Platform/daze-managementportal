import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: LucideIcon;
  iconClass: string;
  hasSubmenu?: boolean;
  submenu?: { name: string; path: string; }[];
}

interface SidebarMenuItemProps {
  item: MenuItem;
  isExpanded: boolean;
  onToggleSubmenu: (itemName: string) => void;
  onClose?: () => void;
  totalActiveOrders: number;
  shouldShowBadges: boolean;
  currentPath: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SidebarMenuItem = ({ 
  item, 
  isExpanded, 
  onToggleSubmenu, 
  onClose, 
  totalActiveOrders, 
  shouldShowBadges,
  currentPath,
  isCollapsed = false,
  onToggleCollapse
}: SidebarMenuItemProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const isActivePath = currentPath.startsWith(item.path);

  useEffect(() => {
    if (isExpanded && isCollapsed && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position dropdown with small gap from collapsed sidebar edge
      setDropdownStyle({
        top: rect.top,
        left: 68  // 64px (sidebar width) + 4px gap
      });
    }
  }, [isExpanded, isCollapsed]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCollapsed && isExpanded && buttonRef.current && dropdownRef.current) {
        const target = event.target as Node;
        const isClickOutside = !buttonRef.current.contains(target) && !dropdownRef.current.contains(target);
        if (isClickOutside) {
          onToggleSubmenu(item.name);
        }
      }
    };

    if (isCollapsed && isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCollapsed, isExpanded, item.name, onToggleSubmenu]);

  if (item.hasSubmenu) {
    return (
      <li className="relative">
        <div>
          <button
            ref={buttonRef}
            data-menu-item={item.name}
            onClick={() => onToggleSubmenu(item.name)}
            className={`w-full flex items-center justify-between py-3 sm:py-3.5 md:py-4 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 group touch-manipulation ${
              isActivePath
                ? (isCollapsed ? 'text-white' : 'bg-white/20 text-white border border-white/30 shadow-lg')
                : (isCollapsed ? 'text-white/80 hover:text-white' : 'text-white/80 hover:bg-white/10 hover:text-white')
            } ${isCollapsed ? 'justify-center px-3 py-3.5 -ml-1' : 'px-4 sm:px-5'}`}
            title={isCollapsed ? item.name : undefined}
          >
            <div className={`flex items-center ${
              isCollapsed ? 'justify-center w-full' : 'space-x-2 sm:space-x-3'
            } flex-1 min-w-0`}>
{isCollapsed ? (
                <span className="relative inline-flex ml-[-1px]">
                  <span
                    aria-hidden
                    className={`absolute -inset-2 rounded-xl pointer-events-none transition-opacity duration-200 ${
                      isActivePath ? 'bg-white/25 opacity-100' : 'bg-white/15 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                  <item.icon className={`${item.iconClass} w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 flex-shrink-0 relative z-[1]`} />
                </span>
              ) : (
                <item.icon className={`${item.iconClass} w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 flex-shrink-0`} />
              )}
              {!isCollapsed && (
                <>
                  <span className="truncate">{item.name}</span>
                  {item.name === 'Orders' && shouldShowBadges && totalActiveOrders > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-auto bg-brand-orange text-white border-brand-orange-dark text-xs px-2 py-1 min-w-[20px] h-6 flex items-center justify-center font-bold animate-pulse shadow-lg"
                    >
                      {totalActiveOrders}
                    </Badge>
                  )}
                </>
              )}
            </div>
            {!isCollapsed && (
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            )}
          </button>
        </div>
        
        {isExpanded && (
          isCollapsed ? createPortal(
            <ul 
              ref={dropdownRef}
              className="space-y-1 bg-[#021945] border border-blue-800/30 rounded-lg shadow-xl p-3 w-48 z-[99999] fixed"
              style={dropdownStyle}
            >
              {item.submenu?.map((subItem) => (
                <li key={subItem.name}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base transition-all duration-200 touch-manipulation ${
                        isActive
                          ? 'bg-white/25 text-white shadow-md border border-white/20'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                    onClick={() => {
                      // Auto-collapse sidebar when clicking on Active Orders
                      if (subItem.name === 'Active orders' && !isCollapsed) {
                        onToggleCollapse?.();
                      }
                      // Allow navigation to complete before closing dropdown
                      setTimeout(() => {
                        onToggleSubmenu(item.name);
                        onClose?.();
                      }, 100);
                    }}
                  >
                    <span className="truncate">{subItem.name}</span>
                    {subItem.name === 'Active orders' && shouldShowBadges && totalActiveOrders > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="bg-brand-orange text-white border-brand-orange-dark text-xs px-2 py-1 min-w-[20px] h-6 flex items-center justify-center font-bold shadow-lg"
                      >
                        {totalActiveOrders}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>,
            document.body
          ) : (
            <ul className="space-y-1 mt-2 ml-4 sm:ml-6 md:ml-8">
              {item.submenu?.map((subItem) => (
                <li key={subItem.name}>
                  <NavLink
                    to={subItem.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base transition-all duration-200 touch-manipulation ${
                        isActive
                          ? 'bg-white/25 text-white shadow-md border border-white/20'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                    onClick={() => {
                      // Auto-collapse sidebar when clicking on Active Orders
                      if (subItem.name === 'Active orders' && !isCollapsed) {
                        onToggleCollapse?.();
                      }
                      onClose?.();
                    }}
                  >
                    <span className="truncate">{subItem.name}</span>
                    {subItem.name === 'Active orders' && shouldShowBadges && totalActiveOrders > 0 && (
                      <Badge 
                        variant="secondary" 
                        className="bg-brand-orange text-white border-brand-orange-dark text-xs px-2 py-1 min-w-[20px] h-6 flex items-center justify-center font-bold shadow-lg"
                      >
                        {totalActiveOrders}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )
        )}
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center py-3 sm:py-3.5 md:py-4 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 group touch-manipulation ${
            isActive
              ? (isCollapsed ? 'text-white' : 'bg-white/20 text-white border border-white/30 shadow-lg')
              : (isCollapsed ? 'text-white/80 hover:text-white' : 'text-white/80 hover:bg-white/10 hover:text-white')
          } ${isCollapsed ? 'justify-center px-3 py-3.5 w-full -ml-1' : 'space-x-2 sm:space-x-3 px-4 sm:px-5'}`
        }
        onClick={() => onClose?.()}
        title={isCollapsed ? item.name : undefined}
      >
{isCollapsed ? (
          <span className="relative inline-flex ml-[-1px]">
            <span
              aria-hidden
              className={`absolute -inset-2 rounded-xl pointer-events-none transition-opacity duration-200 ${
                isActivePath ? 'bg-white/25 opacity-100' : 'bg-white/15 opacity-0 group-hover:opacity-100'
              }`}
            />
            <item.icon className={`${item.iconClass} w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 flex-shrink-0 relative z-[1]`} />
          </span>
        ) : (
          <item.icon className={`${item.iconClass} w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110 flex-shrink-0`} />
        )}
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </NavLink>
    </li>
  );
};