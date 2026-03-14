import React from "react";
import { MenuCard } from "./MenuCard";
import { Menu } from "@/pages/MenuManagement";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

interface MenuListProps {
  menus: Menu[];
  onEditMenu: (menu: Menu) => void;
  onToggleMenuStatus: (menuId: string) => void;
  onDeleteMenu: (menuId: string) => void;
  onAssignStore: (menu: Menu) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export const MenuList: React.FC<MenuListProps> = ({
  menus,
  onEditMenu,
  onToggleMenuStatus,
  onDeleteMenu,
  onAssignStore,
}) => {
  if (menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <UtensilsCrossed className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-base font-medium text-foreground mb-1">
          No menus yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Create your first menu to start managing your offerings.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {menus.map((menu) => (
        <motion.div key={menu.id} variants={item}>
          <MenuCard
            menu={menu}
            onEditMenu={onEditMenu}
            onToggleMenuStatus={onToggleMenuStatus}
            onDeleteMenu={onDeleteMenu}
            onAssignStore={onAssignStore}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
