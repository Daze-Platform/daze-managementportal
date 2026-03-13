import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Settings2,
  ListChecks,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  CircleDot,
  CheckSquare,
  Star,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface OptionSetFormData {
  id?: string;
  name: string;
  description: string;
  required: boolean;
  multipleSelection: boolean;
  minSelections: number;
  maxSelections: number;
  options: ModifierOption[];
}

interface OptionSetEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: OptionSetFormData | null;
  onSave: (data: OptionSetFormData) => void;
}

const defaultFormData: OptionSetFormData = {
  name: "",
  description: "",
  required: false,
  multipleSelection: false,
  minSelections: 0,
  maxSelections: 5,
  options: [],
};

export const OptionSetEditorDialog: React.FC<OptionSetEditorDialogProps> = ({
  open,
  onOpenChange,
  initialData,
  onSave,
}) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("basics");
  const [formData, setFormData] = useState<OptionSetFormData>(defaultFormData);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionPrice, setNewOptionPrice] = useState("");

  useEffect(() => {
    if (open) {
      setFormData(initialData || defaultFormData);
      setActiveTab("basics");
      setNewOptionName("");
      setNewOptionPrice("");
    }
  }, [open, initialData]);

  const handleAddOption = () => {
    if (!newOptionName.trim()) return;

    const newOption: ModifierOption = {
      id: `opt-${Date.now()}`,
      name: newOptionName.trim(),
      price: parseFloat(newOptionPrice) || 0,
      isDefault: formData.options.length === 0,
    };

    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
    setNewOptionName("");
    setNewOptionPrice("");
  };

  const handleRemoveOption = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== optionId),
    }));
  };

  const handleToggleDefault = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) => ({
        ...opt,
        isDefault: formData.multipleSelection
          ? opt.id === optionId
            ? !opt.isDefault
            : opt.isDefault
          : opt.id === optionId,
      })),
    }));
  };

  const handleUpdateOptionPrice = (optionId: string, price: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, price: parseFloat(price) || 0 } : opt,
      ),
    }));
  };

  const handleUpdateOptionName = (optionId: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, name } : opt,
      ),
    }));
  };

  const handleReorder = (newOrder: ModifierOption[]) => {
    setFormData((prev) => ({ ...prev, options: newOrder }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      id: formData.id || `group-${Date.now()}`,
    });
  };

  const isValid = formData.name.trim().length > 0;

  const selectionRuleText = formData.multipleSelection
    ? formData.minSelections > 0
      ? `Select ${formData.minSelections}–${formData.maxSelections} options`
      : `Select up to ${formData.maxSelections} options`
    : "Select one option";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${
          isMobile
            ? "w-[98vw] max-w-none h-[95vh] max-h-none m-2 rounded-xl p-0"
            : "sm:max-w-2xl w-[95vw] max-h-[90vh] p-0"
        } bg-background border-border overflow-hidden flex flex-col`}
      >
        <DialogHeader className="flex-shrink-0 p-6 pb-0">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            {initialData ? "Edit Option Set" : "Create Option Set"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure how customers can customize their order
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList
            className={`mx-6 mt-4 ${isMobile ? "grid grid-cols-3" : "w-fit"}`}
          >
            <TabsTrigger value="basics" className="gap-2">
              <Settings2 className="w-4 h-4" />
              <span className={isMobile ? "sr-only" : ""}>Basics</span>
            </TabsTrigger>
            <TabsTrigger value="options" className="gap-2">
              <ListChecks className="w-4 h-4" />
              <span className={isMobile ? "sr-only" : ""}>Options</span>
              {formData.options.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {formData.options.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              <span className={isMobile ? "sr-only" : ""}>Preview</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {/* Basics Tab */}
            <TabsContent value="basics" className="mt-0 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Size, Toppings, Spice Level"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.name.length}/50 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="e.g., Choose your preferred size"
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Shown to customers as helper text
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${
                    formData.required
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      required: !prev.required,
                    }))
                  }
                >
                  <div className="space-y-0.5">
                    <Label className="cursor-pointer font-medium">
                      Required Selection
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Customer must make a selection
                    </p>
                  </div>
                  <Switch
                    checked={formData.required}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, required: checked }))
                    }
                  />
                </div>

                <div
                  className={`flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer ${
                    formData.multipleSelection
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      multipleSelection: !prev.multipleSelection,
                    }))
                  }
                >
                  <div className="space-y-0.5">
                    <Label className="cursor-pointer font-medium">
                      Allow Multiple
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Customer can select multiple options
                    </p>
                  </div>
                  <Switch
                    checked={formData.multipleSelection}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        multipleSelection: checked,
                      }))
                    }
                  />
                </div>

                <AnimatePresence>
                  {formData.multipleSelection && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Minimum Selections</Label>
                            <span className="text-sm font-medium text-primary">
                              {formData.minSelections}
                            </span>
                          </div>
                          <Slider
                            value={[formData.minSelections]}
                            onValueChange={([val]) =>
                              setFormData((prev) => ({
                                ...prev,
                                minSelections: val,
                                maxSelections: Math.max(
                                  val,
                                  prev.maxSelections,
                                ),
                              }))
                            }
                            max={10}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Maximum Selections</Label>
                            <span className="text-sm font-medium text-primary">
                              {formData.maxSelections}
                            </span>
                          </div>
                          <Slider
                            value={[formData.maxSelections]}
                            onValueChange={([val]) =>
                              setFormData((prev) => ({
                                ...prev,
                                maxSelections: Math.max(
                                  val,
                                  prev.minSelections,
                                ),
                              }))
                            }
                            min={1}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="pt-2 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            {selectionRuleText}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Options Tab */}
            <TabsContent value="options" className="mt-0 space-y-4">
              {/* Add new option */}
              <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="Option name"
                    className="flex-1 h-10"
                    onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                  />
                  <div className="flex gap-2">
                    <Input
                      value={newOptionPrice}
                      onChange={(e) => setNewOptionPrice(e.target.value)}
                      placeholder="+$0.00"
                      className="flex-1 sm:w-24 h-10"
                      type="number"
                      step="0.01"
                      onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                    />
                    <Button
                      type="button"
                      onClick={handleAddOption}
                      disabled={!newOptionName.trim()}
                      size="icon"
                      className="h-10 w-10 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter or click + to add option
                </p>
              </div>

              {/* Options list */}
              {formData.options.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No options yet</p>
                  <p className="text-sm">Add options above to get started</p>
                </div>
              ) : (
                <Reorder.Group
                  axis="y"
                  values={formData.options}
                  onReorder={handleReorder}
                  className="space-y-2"
                >
                  {formData.options.map((option) => (
                    <Reorder.Item
                      key={option.id}
                      value={option}
                      className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />

                      <Input
                        value={option.name}
                        onChange={(e) =>
                          handleUpdateOptionName(option.id, e.target.value)
                        }
                        className="flex-1 h-9 border-0 bg-transparent px-2 focus-visible:ring-1"
                      />

                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input
                          value={option.price}
                          onChange={(e) =>
                            handleUpdateOptionPrice(option.id, e.target.value)
                          }
                          className="w-16 h-9 border-0 bg-transparent px-1 text-right focus-visible:ring-1"
                          type="number"
                          step="0.01"
                        />
                      </div>

                      <Button
                        type="button"
                        variant={option.isDefault ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => handleToggleDefault(option.id)}
                        title={
                          option.isDefault ? "Default option" : "Set as default"
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${option.isDefault ? "fill-current" : ""}`}
                        />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveOption(option.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="mt-0">
              <div className="max-w-sm mx-auto">
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {formData.name || "Option Set Name"}
                      </h3>
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {formData.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      {formData.required && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-amber-700 text-xs"
                        >
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Selection rule */}
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectionRuleText}
                  </p>

                  {/* Options preview */}
                  <div className="space-y-2">
                    {formData.options.length === 0 ? (
                      <div className="py-6 text-center text-muted-foreground text-sm">
                        Add options to see preview
                      </div>
                    ) : (
                      formData.options.map((option) => (
                        <div
                          key={option.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                            option.isDefault
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-muted-foreground/30"
                          }`}
                        >
                          {formData.multipleSelection ? (
                            <CheckSquare
                              className={`w-5 h-5 ${option.isDefault ? "text-primary" : "text-muted-foreground"}`}
                            />
                          ) : (
                            <CircleDot
                              className={`w-5 h-5 ${option.isDefault ? "text-primary" : "text-muted-foreground"}`}
                            />
                          )}
                          <span className="flex-1 font-medium text-sm">
                            {option.name}
                          </span>
                          {option.price !== 0 && (
                            <span
                              className={`text-sm font-medium ${option.price > 0 ? "text-success" : "text-destructive"}`}
                            >
                              {option.price > 0 ? "+" : ""}$
                              {Math.abs(option.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  This is how customers will see this option set
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-border bg-muted/30">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              {initialData ? "Save Changes" : "Create Option Set"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
