import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getModifierGroupsForStore } from '@/data/modifierGroups';
import { useToast } from '@/hooks/use-toast';

interface ModifiersViewProps {
  storeId: string;
  storeName: string;
}

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
        title: "Name required",
        description: "Please enter a name for the modifier group.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: editingGroup ? "Modifier updated" : "Modifier created",
      description: `${formData.name} has been saved.`,
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
    setFormData({ name: '', required: false, multipleSelection: false });
    setEditingGroup(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {modifierGroups.length} modifier {modifierGroups.length === 1 ? 'group' : 'groups'}
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          size="sm"
          className="h-8 px-3 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Modifier
        </Button>
      </div>

      {/* Modifier list */}
      {modifierGroups.length > 0 ? (
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_100px_80px_44px] gap-4 px-4 py-3 bg-muted/30 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div>Name</div>
            <div>Required</div>
            <div>Multiple</div>
            <div>Options</div>
            <div></div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {modifierGroups.map((group) => (
              <div 
                key={group.id} 
                className="grid grid-cols-[1fr_100px_100px_80px_44px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-medium text-sm text-foreground truncate">
                    {group.name}
                  </div>
                  {group.description && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                      {group.description}
                    </div>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {group.required ? 'Yes' : 'No'}
                </div>

                <div className="text-sm text-muted-foreground">
                  {group.multipleSelection ? 'Yes' : 'No'}
                </div>

                <div className="text-sm text-muted-foreground">
                  {group.options.length}
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => handleEditGroup(group)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-border rounded-lg bg-card">
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">No modifiers yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create modifier groups to add customization options to your menu items.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Modifier
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle className="text-base font-semibold">
              {editingGroup ? 'Edit modifier' : 'New modifier'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="groupName" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="groupName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Size, Toppings"
                className="h-10"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <Label className="text-sm font-medium">Required</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customer must select an option
                  </p>
                </div>
                <Switch
                  checked={formData.required}
                  onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <Label className="text-sm font-medium">Allow multiple</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customer can select more than one
                  </p>
                </div>
                <Switch
                  checked={formData.multipleSelection}
                  onCheckedChange={(checked) => setFormData({ ...formData, multipleSelection: checked })}
                />
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCloseDialog}>
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
