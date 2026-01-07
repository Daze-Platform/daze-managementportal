import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Settings2, ChevronRight } from 'lucide-react';
import { getModifierGroupsForStore } from '@/data/modifierGroups';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface ModifiersViewProps {
  storeId: string;
  storeName: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 }
};

export const ModifiersView: React.FC<ModifiersViewProps> = ({ storeId, storeName }) => {
  const modifierGroups = getModifierGroupsForStore(storeId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    required: false,
    multipleSelection: false
  });
  const { toast } = useToast();

  const handleSaveModifierGroup = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the option set.",
        variant: "destructive"
      });
      return;
    }

    if (editingGroup) {
      toast({
        title: "Option Set Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Option Set Created",
        description: `${formData.name} has been created successfully.`,
      });
    }

    handleCloseDialog();
  };

  const handleEditGroup = (group: any) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      required: group.required || false,
      multipleSelection: group.multipleSelection || false
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFormData({
      name: '',
      required: false,
      multipleSelection: false
    });
    setEditingGroup(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {modifierGroups.length} option {modifierGroups.length === 1 ? 'set' : 'sets'} for {storeName}
          </p>
        </div>
        
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="h-10 px-4 bg-foreground hover:bg-foreground/90 text-background font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Option Set
        </Button>
      </div>

      {/* Option Sets List */}
      {modifierGroups.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {modifierGroups.map((group) => (
            <motion.div 
              key={group.id} 
              variants={item}
              className="group bg-card border border-border rounded-xl p-5 hover:border-foreground/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{group.name}</h3>
                    <div className="flex items-center gap-2">
                      {group.required && (
                        <Badge variant="secondary" className="text-[10px] font-medium bg-destructive/10 text-destructive border-0">
                          Required
                        </Badge>
                      )}
                      {group.multipleSelection && (
                        <Badge variant="secondary" className="text-[10px] font-medium">
                          Multi-select
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                  )}
                  
                  {/* Options preview */}
                  <div className="flex flex-wrap gap-2">
                    {group.options.slice(0, 4).map((option) => (
                      <span 
                        key={option.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-md text-xs text-muted-foreground"
                      >
                        <span>{option.name}</span>
                        {option.price !== 0 && (
                          <span className={option.price > 0 ? 'text-success' : ''}>
                            {option.price > 0 ? `+$${option.price.toFixed(2)}` : `-$${Math.abs(option.price).toFixed(2)}`}
                          </span>
                        )}
                      </span>
                    ))}
                    {group.options.length > 4 && (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs text-muted-foreground">
                        +{group.options.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEditGroup(group)} 
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 px-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
            <Settings2 className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No option sets yet
          </h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Create option sets to add customizations like sizes, toppings, or extras to your menu items.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-foreground hover:bg-foreground/90 text-background"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Option Set
          </Button>
        </motion.div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Edit Option Set' : 'New Option Set'}
            </DialogTitle>
            <DialogDescription>
              Create modifiers that can be applied to menu items.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Name</Label>
              <Input
                id="groupName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Drink Size, Toppings"
              />
            </div>
            
            <div className="space-y-3">
              <div 
                onClick={() => setFormData({ ...formData, required: !formData.required })}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.required 
                    ? 'border-foreground bg-foreground/5' 
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                <Checkbox
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
                />
                <div>
                  <Label className="cursor-pointer font-medium">Required</Label>
                  <p className="text-xs text-muted-foreground">Customer must choose an option</p>
                </div>
              </div>
              
              <div 
                onClick={() => setFormData({ ...formData, multipleSelection: !formData.multipleSelection })}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  formData.multipleSelection 
                    ? 'border-foreground bg-foreground/5' 
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                <Checkbox
                  checked={formData.multipleSelection}
                  onCheckedChange={(checked) => setFormData({ ...formData, multipleSelection: checked as boolean })}
                />
                <div>
                  <Label className="cursor-pointer font-medium">Allow Multiple</Label>
                  <p className="text-xs text-muted-foreground">Customer can select multiple options</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveModifierGroup}
              className="bg-foreground hover:bg-foreground/90 text-background"
            >
              {editingGroup ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
