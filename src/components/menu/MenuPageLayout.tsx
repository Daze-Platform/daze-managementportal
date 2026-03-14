import React from "react";

interface MenuPageLayoutProps {
  children: React.ReactNode;
  title: string;
  headerActions?: React.ReactNode;
}

export const MenuPageLayout = ({
  children,
  title,
  headerActions,
}: MenuPageLayoutProps) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {headerActions && (
            <div className="flex items-center space-x-2">{headerActions}</div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 scroll-container">
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
