import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Sparkles, Building2, Pencil, Check, X } from "lucide-react";
import { useStores } from "@/contexts/StoresContext";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

interface MenuFormData {
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  items: MenuItem[];
  venueId?: string;
}

const categories = [
  "restaurant",
  "bar",
  "cafe",
  "bakery",
  "dessert",
  "drinks",
];

interface MenuMetadataFormProps {
  formData: MenuFormData;
  onFormDataChange: (data: MenuFormData) => void;
  availableVenues: any[];
}

export const MenuMetadataForm = ({
  formData,
  onFormDataChange,
  availableVenues,
}: MenuMetadataFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="menuName">Menu Name</Label>
        <Input
          id="menuName"
          value={formData.name}
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              name: e.target.value,
            })
          }
          placeholder="e.g., Summer Menu 2024"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              onFormDataChange({ ...formData, category: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex items-center justify-between h-10 px-3 rounded-md border border-input bg-background">
            <span className="text-sm">
              {formData.isActive ? "Active" : "Draft"}
            </span>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                onFormDataChange({
                  ...formData,
                  isActive: checked,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="menuDescription">Description</Label>
        <Textarea
          id="menuDescription"
          value={formData.description}
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              description: e.target.value,
            })
          }
          placeholder="Describe your menu..."
          className="min-h-[80px] resize-none"
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>

      <div className="space-y-2">
        <Label>Assign to Venue</Label>
        <Select
          value={formData.venueId || ""}
          onValueChange={(value) =>
            onFormDataChange({ ...formData, venueId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a venue" />
          </SelectTrigger>
          <SelectContent>
            {availableVenues.length > 0 ? (
              availableVenues.map((venue) => (
                <SelectItem
                  key={venue.id}
                  value={venue.id.toString()}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {venue.name}
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No venues available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Menus can be assigned to specific venues or left unassigned to apply across all venues.
        </p>
      </div>
    </div>
  );
};

interface MenuItemFormProps {
  item: MenuItem | null;
  index: number | null;
  isEditMode: boolean;
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
  onImageUpload?: (file: File, callback: (image: string) => void) => void;
}

export const MenuItemForm = ({
  item,
  index,
  isEditMode,
  onSave,
  onCancel,
  onImageUpload,
}: MenuItemFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentItem, setCurrentItem] = React.useState<MenuItem>(
    item || {
      name: "",
      description: "",
      price: 0,
      category: "main",
      available: true,
    }
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file, (image) => {
        setCurrentItem((prev) => ({ ...prev, image }));
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="itemName">Item Name</Label>
        <Input
          id="itemName"
          value={currentItem.name}
          onChange={(e) =>
            setCurrentItem((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., Grilled Salmon"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="itemDesc">Description</Label>
        <Textarea
          id="itemDesc"
          value={currentItem.description}
          onChange={(e) =>
            setCurrentItem((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Describe the item..."
          className="min-h-[80px] resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="itemPrice">Price</Label>
          <PriceInput
            id="itemPrice"
            value={currentItem.price.toString()}
            onChange={(value) =>
              setCurrentItem((prev) => ({
                ...prev,
                price: value,
              }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemCat">Category</Label>
          <Select
            value={currentItem.category}
            onValueChange={(value) =>
              setCurrentItem((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger id="itemCat">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["appetizer", "main", "side", "dessert", "beverage"].map(
                (cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between h-10 px-3 rounded-md border border-input bg-background">
        <span className="text-sm">
          {currentItem.available ? "Available" : "Out of Stock"}
        </span>
        <Switch
          checked={currentItem.available}
          onCheckedChange={(checked) =>
            setCurrentItem((prev) => ({ ...prev, available: checked }))
          }
        />
      </div>

      {currentItem.image && (
        <div className="relative w-full rounded-lg overflow-hidden bg-muted h-32">
          <img
            src={currentItem.image}
            alt={currentItem.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() =>
              setCurrentItem((prev) => ({ ...prev, image: undefined }))
            }
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed rounded-lg hover:border-primary transition-colors"
      >
        <Upload className="w-4 h-4" />
        <span>{currentItem.image ? "Change" : "Add"} Image</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          onClick={() => onSave(currentItem)}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-2" />
          {isEditMode ? "Save" : "Add Item"}
        </Button>
        <Button onClick={onCancel} variant="outline" className="flex-1">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

interface MenuItemsListProps {
  items: MenuItem[];
  onEditItem: (index: number) => void;
  onDeleteItem: (index: number) => void;
}

export const MenuItemsList = ({
  items,
  onEditItem,
  onDeleteItem,
}: MenuItemsListProps) => {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {item.image && (
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
            {!item.available && (
              <Badge variant="secondary" className="text-xs">
                Out
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditItem(index)}
              className="h-8 w-8"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteItem(index)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
