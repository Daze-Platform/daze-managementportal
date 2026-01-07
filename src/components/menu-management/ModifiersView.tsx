import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash2, DollarSign, Settings2, Layers } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Option Sets</h2>
                <p className="text-gray-600 text-sm mt-0.5">Manage modifiers and customization options for {storeName}</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option Set
              </Button>
              <DialogContent className="max-w-md p-0 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl">
                <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      {editingGroup ? 'Edit Option Set' : 'Add Option Set'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-1">
                      Create modifiers that can be applied to menu items
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="groupName" className="text-sm font-semibold text-gray-700">Option Set Name</Label>
                    <Input
                      id="groupName"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Drink Size, Toppings"
                      className="h-12 border-gray-200"
                    />
                  </div>
                  <div className="space-y-3">
                    <div 
                      onClick={() => setFormData({ ...formData, required: !formData.required })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.required 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        id="required"
                        checked={formData.required}
                        onCheckedChange={(checked) => setFormData({ ...formData, required: checked as boolean })}
                        className="w-5 h-5 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="required" className="text-sm font-semibold text-gray-900 cursor-pointer">Required Selection</Label>
                        <p className="text-xs text-gray-500 mt-0.5">Customer must choose an option</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setFormData({ ...formData, multipleSelection: !formData.multipleSelection })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        formData.multipleSelection 
                          ? 'border-indigo-500 bg-indigo-50' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox
                        id="multiple"
                        checked={formData.multipleSelection}
                        onCheckedChange={(checked) => setFormData({ ...formData, multipleSelection: checked as boolean })}
                        className="w-5 h-5 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                      />
                      <div className="flex-1">
                        <Label htmlFor="multiple" className="text-sm font-semibold text-gray-900 cursor-pointer">Allow Multiple</Label>
                        <p className="text-xs text-gray-500 mt-0.5">Customer can select multiple options</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseDialog} className="border-gray-200">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveModifierGroup}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md"
                  >
                    {editingGroup ? 'Update Option Set' : 'Create Option Set'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Option Sets Grid */}
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modifierGroups.map((group) => (
              <Card key={group.id} className="border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-bold text-gray-900 truncate">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {group.required && (
                          <Badge className="text-xs bg-red-100 text-red-700 border-0 font-medium">Required</Badge>
                        )}
                        {group.multipleSelection && (
                          <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700 border-0 font-medium">Multiple</Badge>
                        )}
                        <Badge variant="outline" className="text-xs font-medium">
                          {group.options.length} options
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)} className="h-8 w-8 p-0 hover:bg-blue-50">
                        <Edit className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {group.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{group.description}</p>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="max-h-40">
                    <div className="space-y-2">
                      {group.options.slice(0, 5).map((option) => (
                        <div key={option.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{option.name}</span>
                            {option.isDefault && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">Default</Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm font-semibold">
                            {option.price !== 0 ? (
                              <span className={option.price > 0 ? 'text-emerald-600' : 'text-gray-600'}>
                                {option.price > 0 ? `+$${option.price.toFixed(2)}` : `-$${Math.abs(option.price).toFixed(2)}`}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">Free</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {group.options.length > 5 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          +{group.options.length - 5} more options
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>

          {modifierGroups.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Layers className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No option sets yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first option set to add customization options like sizes, toppings, or add-ons to your menu items.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option Set
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};