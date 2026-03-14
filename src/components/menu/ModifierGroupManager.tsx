import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { Plus, Edit2, Trash2, Settings } from "lucide-react";

interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: "single" | "multiple";
  required: boolean;
  options: ModifierOption[];
}

export const ModifierGroupManager: React.FC = () => {
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([
    {
      id: "sizes",
      name: "Sizes",
      type: "single",
      required: true,
      options: [
        { id: "1", name: "Small", price: 0 },
        { id: "2", name: "Medium", price: 2.0 },
        { id: "3", name: "Large", price: 4.0 },
      ],
    },
    {
      id: "sauces",
      name: "Sauces",
      type: "multiple",
      required: false,
      options: [
        { id: "1", name: "BBQ", price: 0.5 },
        { id: "2", name: "Ranch", price: 0.5 },
        { id: "3", name: "Hot Sauce", price: 0.5 },
      ],
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      type: "single" as "single" | "multiple",
      required: false,
    },
  });

  const handleSubmit = (data: any) => {
    const newGroup: ModifierGroup = {
      id: editingGroup?.id || Date.now().toString(),
      name: data.name,
      type: data.type,
      required: data.required,
      options: editingGroup?.options || [],
    };

    if (editingGroup) {
      setModifierGroups((prev) =>
        prev.map((g) => (g.id === editingGroup.id ? newGroup : g)),
      );
    } else {
      setModifierGroups((prev) => [...prev, newGroup]);
    }

    setShowCreateDialog(false);
    setEditingGroup(null);
    form.reset();
  };

  const deleteGroup = (groupId: string) => {
    setModifierGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const addOption = (groupId: string, option: ModifierOption) => {
    setModifierGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, options: [...g.options, option] } : g,
      ),
    );
  };

  const deleteOption = (groupId: string, optionId: string) => {
    setModifierGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, options: g.options.filter((o) => o.id !== optionId) }
          : g,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <span>Modifier Groups</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage options and add-ons for your items
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingGroup(null);
            setShowCreateDialog(true);
          }}
          className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Group
        </Button>
      </div>

      {modifierGroups.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300 bg-gradient-to-br from-gray-50/50 to-white/80">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Settings className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2 text-gray-900">
              No modifier groups yet
            </h4>
            <p className="text-gray-600 mb-4 text-center text-sm max-w-xs">
              Create modifier groups like "Sizes", "Toppings", or "Extras" for
              your menu items.
            </p>
            <Button
              onClick={() => {
                setEditingGroup(null);
                setShowCreateDialog(true);
              }}
              size="sm"
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {modifierGroups.map((group) => (
            <Card
              key={group.id}
              className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white/90 backdrop-blur-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{group.name}</h4>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => {
                        setEditingGroup(group);
                        form.reset({
                          name: group.name,
                          type: group.type,
                          required: group.required,
                        });
                        setShowCreateDialog(true);
                      }}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      onClick={() => deleteGroup(group.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      group.type === "single"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {group.type === "single"
                      ? "Single choice"
                      : "Multiple choice"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      group.required
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {group.required ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-2"
                    >
                      <span className="font-medium">{option.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-semibold">
                          {option.price > 0
                            ? `+$${option.price.toFixed(2)}`
                            : "Free"}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => deleteOption(group.id, option.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs border-dashed border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    onClick={() => {
                      const optionName = prompt("Option name:");
                      const optionPrice = prompt(
                        "Additional price (0 for free):",
                      );
                      if (optionName && optionPrice !== null) {
                        addOption(group.id, {
                          id: Date.now().toString(),
                          name: optionName,
                          price: parseFloat(optionPrice) || 0,
                        });
                      }
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Option
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modifier Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border border-gray-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {editingGroup ? "Edit Modifier Group" : "Create Modifier Group"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selection Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <label htmlFor="single" className="text-sm">
                            Single choice (customer picks one)
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id="multiple" />
                          <label htmlFor="multiple" className="text-sm">
                            Multiple choice (customer can pick several)
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="rounded border-gray-300"
                      />
                      <FormLabel>Required selection</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {editingGroup ? "Update Group" : "Create Group"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
