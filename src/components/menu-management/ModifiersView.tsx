import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Settings, 
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal
} from 'lucide-react';
import { getModifierGroupsForStore, ModifierGroup } from '@/data/modifierGroups';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { OptionSetEditorDialog, OptionSetFormData } from './OptionSetEditorDialog';
import { OptionSetCard } from './OptionSetCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModifiersViewProps {
  storeId: string;
  storeName: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

type SortOption = 'name' | 'options' | 'type';

export const ModifiersView: React.FC<ModifiersViewProps> = ({ storeId, storeName }) => {
  const baseModifierGroups = getModifierGroupsForStore(storeId);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(baseModifierGroups);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  // Filter and sort modifier groups
  const filteredGroups = useMemo(() => {
    let filtered = modifierGroups.filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'options':
        filtered.sort((a, b) => b.options.length - a.options.length);
        break;
      case 'type':
        filtered.sort((a, b) => {
          if (a.required !== b.required) return a.required ? -1 : 1;
          return a.multipleSelection === b.multipleSelection ? 0 : a.multipleSelection ? 1 : -1;
        });
        break;
    }

    return filtered;
  }, [modifierGroups, searchQuery, sortBy]);

  const handleSaveModifierGroup = (data: OptionSetFormData) => {
    if (editingGroup) {
      // Update existing
      setModifierGroups(prev => prev.map(g => 
        g.id === editingGroup.id 
          ? { ...g, ...data, id: g.id }
          : g
      ));
      toast({
        title: "Option Set Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Create new
      const newGroup: ModifierGroup = {
        id: data.id || `group-${Date.now()}`,
        name: data.name,
        description: data.description,
        required: data.required,
        multipleSelection: data.multipleSelection,
        minSelections: data.minSelections,
        maxSelections: data.maxSelections,
        options: data.options
      };
      setModifierGroups(prev => [...prev, newGroup]);
      toast({
        title: "Option Set Created",
        description: `${data.name} has been created successfully.`,
      });
    }

    handleCloseDialog();
  };

  const handleEditGroup = (group: ModifierGroup) => {
    setEditingGroup(group);
    setIsDialogOpen(true);
  };

  const handleDeleteGroup = (group: ModifierGroup) => {
    setModifierGroups(prev => prev.filter(g => g.id !== group.id));
    toast({
      title: "Option Set Deleted",
      description: `${group.name} has been deleted.`,
    });
  };

  const handleDuplicateGroup = (group: ModifierGroup) => {
    const duplicated: ModifierGroup = {
      ...group,
      id: `group-${Date.now()}`,
      name: `${group.name} (Copy)`,
      options: group.options.map(opt => ({
        ...opt,
        id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }))
    };
    setModifierGroups(prev => [...prev, duplicated]);
    toast({
      title: "Option Set Duplicated",
      description: `${duplicated.name} has been created.`,
    });
  };

  const handleCloseDialog = () => {
    setEditingGroup(null);
    setIsDialogOpen(false);
  };

  const convertToFormData = (group: ModifierGroup): OptionSetFormData => ({
    id: group.id,
    name: group.name,
    description: group.description || '',
    required: group.required,
    multipleSelection: group.multipleSelection,
    minSelections: group.minSelections || 0,
    maxSelections: group.maxSelections || 5,
    options: group.options
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="h-7 px-3">
              {modifierGroups.length} option set{modifierGroups.length !== 1 ? 's' : ''}
            </Badge>
            {searchQuery && (
              <span className="text-sm text-muted-foreground">
                {filteredGroups.length} result{filteredGroups.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <Button onClick={() => setIsDialogOpen(true)} className="h-9 px-4">
            <Plus className="w-4 h-4 mr-2" />
            New Option Set
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search option sets..."
              className="pl-9 h-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[140px] h-10">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="options">Options Count</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-lg border border-border p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Option Sets Grid/List */}
      <AnimatePresence mode="wait">
        {filteredGroups.length > 0 ? (
          <motion.div 
            key="grid"
            variants={container}
            initial="hidden"
            animate="show"
            className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
              : 'flex flex-col gap-3'
            }
          >
            {filteredGroups.map((group) => (
              <motion.div key={group.id} variants={item}>
                <OptionSetCard
                  group={group}
                  onEdit={handleEditGroup}
                  onDelete={handleDeleteGroup}
                  onDuplicate={handleDuplicateGroup}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : searchQuery ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <Search className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-base font-medium text-foreground mb-1">
              No results found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              No option sets match "{searchQuery}". Try a different search term.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Settings className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No option sets yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Option sets let customers customize their orders with choices like size, toppings, or preparation styles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Option Set
              </Button>
            </div>

            {/* Quick Templates */}
            <div className="mt-8 pt-6 border-t border-border w-full max-w-md">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                Quick Start Templates
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Size (S/M/L)', 'Spice Level', 'Add-ons', 'Cooking Temp'].map((template) => (
                  <Button 
                    key={template} 
                    variant="outline" 
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      // Pre-populate based on template
                      setIsDialogOpen(true);
                    }}
                  >
                    {template}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor Dialog */}
      <OptionSetEditorDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
          else setIsDialogOpen(true);
        }}
        initialData={editingGroup ? convertToFormData(editingGroup) : null}
        onSave={handleSaveModifierGroup}
      />
    </div>
  );
};
