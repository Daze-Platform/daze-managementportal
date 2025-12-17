import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { getModifierGroupsForStore } from '@/data/modifierGroups';
import { useToast } from '@/hooks/use-toast';

interface ModifiersViewProps {
  storeId: string;
  storeName: string;
}

export const ModifiersView: React.FC<ModifiersViewProps> = ({ storeId, storeName }) => {
  // Get store-specific modifier groups
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
        description: "Please enter a name for the modifier group.",
        variant: "destructive"
      });
      return;
    }

    if (editingGroup) {
      toast({
        title: "Modifier Group Updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      toast({
        title: "Modifier Group Created",
        description: `${formData.name} has been created successfully.`,
        className: "bg-green-50 border-green-200 text-green-800",
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Modifier Groups</h2>
          <p className="text-gray-600 mt-1">Manage modifier groups for {storeName}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Modifier Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGroup ? 'Edit Modifier Group' : 'Add Modifier Group'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Drink Size, Toppings"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={formData.required}
                    onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
                  />
                  <Label htmlFor="required">Required selection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiple"
                    checked={formData.multipleSelection}
                    onCheckedChange={(checked) => setFormData({ ...formData, multipleSelection: checked as boolean })}
                  />
                  <Label htmlFor="multiple">Allow multiple selections</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleSaveModifierGroup}>
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {modifierGroups.map((group) => (
          <Card key={group.id} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {group.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                    {group.multipleSelection && (
                      <Badge variant="secondary" className="text-xs">Multiple</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {group.options.length} options
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {group.description && (
                <p className="text-sm text-gray-600 mt-2">{group.description}</p>
              )}
              {(group.minSelections || group.maxSelections) && (
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  {group.minSelections && (
                    <span>Min: {group.minSelections}</span>
                  )}
                  {group.maxSelections && (
                    <span>Max: {group.maxSelections}</span>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Options:</h4>
                <div className="grid gap-2">
                  {group.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{option.name}</span>
                        {option.isDefault && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {option.price !== 0 && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {option.price > 0 ? `+${option.price.toFixed(2)}` : option.price.toFixed(2)}
                          </div>
                        )}
                        {option.price === 0 && (
                          <span className="text-xs text-gray-500">Free</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modifierGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modifier groups yet</h3>
          <p className="text-gray-600 mb-4">Create your first modifier group to get started</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Modifier Group
          </Button>
        </div>
      )}
    </div>
  );
};