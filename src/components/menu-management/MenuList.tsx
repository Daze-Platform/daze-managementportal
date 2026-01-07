import React from 'react';
import { MenuCard } from './MenuCard';
import { Menu } from '@/pages/MenuManagement';
import { motion } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    transition: { staggerChildren: 0.06 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
};

export const MenuList: React.FC<MenuListProps> = ({ 
  menus, 
  onEditMenu, 
  onToggleMenuStatus, 
  onDeleteMenu, 
  onAssignStore 
}) => {
  if (menus.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
          <BookOpen className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No menus yet
        </h3>
        <p className="text-muted-foreground text-center max-w-sm mb-6">
          Create your first menu to start showcasing your culinary offerings to guests.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
    >
      {menus.map((menu, index) => (
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
