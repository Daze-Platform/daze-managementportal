import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface Menu {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  categories: any[];
}

interface MenuHeaderProps {
  menu: Menu;
  onMenuUpdate: (updates: Partial<Menu>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({
  menu,
  onMenuUpdate,
  onCancel,
  isNew,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? "space-y-4" : "flex items-start gap-8"}`}>
      <div
        className={`${isMobile ? "space-y-4" : "flex items-start space-x-6"} flex-1 min-w-0`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className={`hover:bg-brand-blue/10 text-gray-600 hover:text-brand-blue ${
            isMobile
              ? "w-full justify-start h-9 text-sm"
              : "h-9 text-sm flex-shrink-0 mt-1"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div
          className={`${isMobile ? "space-y-3" : "flex-1 min-w-0 max-w-3xl space-y-3"}`}
        >
          {isNew && (
            <Label
              htmlFor="menu-name"
              className="text-sm font-medium text-gray-600"
            >
              Menu Name
            </Label>
          )}
          <Input
            id="menu-name"
            value={menu.name}
            onChange={(e) => onMenuUpdate({ name: e.target.value })}
            className={`${
              isNew
                ? `border-2 border-blue-200 focus:border-blue-500 px-4 py-3 rounded-lg ${
                    isMobile ? "h-12 text-lg" : "h-14 text-2xl"
                  } font-semibold placeholder:text-gray-400`
                : `border-none p-0 h-auto ${
                    isMobile ? "text-xl" : "text-2xl"
                  } font-semibold bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400`
            }`}
            autoFocus={isNew}
            placeholder="Enter menu name..."
          />
          <Input
            value={menu.description}
            onChange={(e) => onMenuUpdate({ description: e.target.value })}
            className={`text-gray-600 border-none p-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 ${
              isMobile ? "text-base mt-2" : "text-lg mt-1"
            }`}
            placeholder="Add a description for your menu..."
          />
        </div>
      </div>
    </div>
  );
};
