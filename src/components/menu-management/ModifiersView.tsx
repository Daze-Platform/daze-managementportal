import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';
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
    transition: { staggerChildren: 0.04 }
  }
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
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

    toast({
      title: editingGroup ? "Option Set Updated" : "Option Set Created",
      description: `${formData.name} has been ${editingGroup ? 'updated' : 'created'} successfully.`,
    });

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
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{modifierGroups.length}</span>
          {' '}{modifierGroups.length === 1 ? 'option set' : 'option sets'}
        </div>
        
        <Button onClick={() => setIsDialogOpen(true)} className="h-9 px-4">
          <Plus className="w-4 h-4 mr-2" />
          New Option Set
        </Button>
      </div>

      {/* Option Sets Grid */}
      {modifierGroups.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {modifierGroups.map((group) => (
            <motion.div 
              key={group.id} 
              variants={item}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-2">{group.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {group.required && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        Required
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {group.multipleSelection ? 'Multi-select' : 'Single choice'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditGroup(group)} 
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {group.options.slice(0, 6).map((option) => (
                  <div 
                    key={option.id}
                    className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-lg text-sm"
                  >
                    <span className="text-foreground truncate">{option.name}</span>
                    {option.price !== 0 && (
                      <span className={`text-xs font-medium ml-2 shrink-0 ${option.price > 0 ? 'text-success' : 'text-destructive'}`}>
                        {option.price > 0 ? '+' : ''}{option.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {group.options.length > 6 && (
                  <div className="flex items-center justify-center px-3 py-2 text-sm text-muted-foreground">
                    +{group.options.length - 6} more
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            No option sets yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mb-4">
            Create option sets to add customizations like sizes or toppings.
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Create Option Set
          </Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Edit Option Set' : 'New Option Set'}
            </DialogTitle>
            <DialogDescription>
              Option sets can be applied to menu items for customization.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.required ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <Checkbox
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
                />
                <div className="flex-1">
                  <Label className="cursor-pointer text-sm font-medium">Required</Label>
                  <p className="text-xs text-muted-foreground">Customer must select an option</p>
                </div>
              </div>
              
              <div 
                onClick={() => setFormData({ ...formData, multipleSelection: !formData.multipleSelection })}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.multipleSelection ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'
                }`}
              >
                <Checkbox
                  checked={formData.multipleSelection}
                  onCheckedChange={(checked) => setFormData({ ...formData, multipleSelection: checked as boolean })}
                />
                <div className="flex-1">
                  <Label className="cursor-pointer text-sm font-medium">Allow Multiple</Label>
                  <p className="text-xs text-muted-foreground">Customer can select multiple options</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveModifierGroup}>
              {editingGroup ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
