import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StoreHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface Store {
  id?: number;
  name: string;
  address: string;
  locationDescription?: string;
  logo: string;
  customLogo?: string;
  bgColor: string;
  activeOrders: number;
  hours: StoreHours[];
  resortId?: string | null;
}

interface StoreFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (store: Store) => void;
  store?: Store;
}

const colorOptions = [
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-pink-500", label: "Pink" },
  { value: "bg-indigo-500", label: "Indigo" },
  { value: "bg-orange-500", label: "Orange" },
];
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const StoreForm = ({
  isOpen,
  onClose,
  onSubmit,
  store,
}: StoreFormProps) => {
  const [customLogo, setCustomLogo] = useState<string>("");
  const [resorts, setResorts] = useState<{ id: string; name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<Store>({
    defaultValues: {
      name: "",
      address: "",
      locationDescription: "",
      logo: "",
      customLogo: "",
      bgColor: "bg-purple-500",
      activeOrders: 0,
      hours: days.map((day) => ({
        day,
        open: "09:00",
        close: "17:00",
        isOpen: false,
      })),
      resortId: null,
    },
  });

  // Load resorts on component mount
  React.useEffect(() => {
    const loadResorts = async () => {
      const { data } = await supabase
        .from("resorts")
        .select("id, name")
        .order("name");
      if (data) setResorts(data);
    };
    loadResorts();
  }, []);

  // Initialize form and states when store prop changes
  React.useEffect(() => {
    if (store) {
      // Reset form with store data
      form.reset({
        name: store.name,
        address: store.address,
        locationDescription: store.locationDescription || "",
        logo: store.logo || "",
        customLogo: store.customLogo || "",
        bgColor: store.bgColor || "bg-purple-500",
        activeOrders: store.activeOrders || 0,
        hours:
          store.hours ||
          days.map((day) => ({
            day,
            open: "09:00",
            close: "17:00",
            isOpen: false,
          })),
        resortId: store.resortId || null,
      });

      // Set logo state
      setCustomLogo(store.customLogo || "");
    } else {
      // Reset form for new store
      form.reset({
        name: "",
        address: "",
        locationDescription: "",
        logo: "",
        customLogo: "",
        bgColor: "bg-purple-500",
        activeOrders: 0,
        hours: days.map((day) => ({
          day,
          open: "09:00",
          close: "17:00",
          isOpen: false,
        })),
        resortId: null,
      });

      setCustomLogo("");
    }
  }, [store, form]);

  const { fields } = useFieldArray({
    control: form.control,
    name: "hours",
  });

  const ensureBucketExists = async () => {
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === "store-logos");

      if (!bucketExists) {
        await supabase.storage.createBucket("store-logos", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      }
    } catch (error) {
      console.log("Bucket check/create skipped:", error);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      await ensureBucketExists();

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `stores/${fileName}`;

      const { data, error } = await supabase.storage
        .from("store-logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error:", error);
        // Fallback to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setCustomLogo(result);
          form.setValue("customLogo", result);
        };
        reader.readAsDataURL(file);
        toast({
          title: "Using local preview",
          description: "Logo will be stored when you save.",
        });
      } else {
        const { data: urlData } = supabase.storage
          .from("store-logos")
          .getPublicUrl(filePath);

        const logoUrl = urlData.publicUrl;
        setCustomLogo(logoUrl);
        form.setValue("customLogo", logoUrl);
        toast({
          title: "Logo uploaded",
          description: "Your logo has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCustomLogo = async () => {
    // If it's a storage URL, try to delete from storage
    if (customLogo && customLogo.includes("store-logos")) {
      try {
        const urlParts = customLogo.split("/store-logos/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabase.storage.from("store-logos").remove([filePath]);
        }
      } catch (error) {
        console.error("Error deleting logo from storage:", error);
      }
    }
    setCustomLogo("");
    form.setValue("customLogo", "");
  };

  const handleSubmit = (data: Store) => {
    const finalData = {
      ...data,
      customLogo: customLogo,
    };

    onSubmit({ ...finalData, id: store?.id });
    form.reset();
    setCustomLogo("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-screen sm:w-[90vw] sm:h-[90vh] sm:max-w-[600px] sm:max-h-[800px] m-0 sm:m-auto p-0 rounded-none sm:rounded-lg border-0 sm:border [&>button]:hidden">
        <div className="flex flex-col h-screen sm:h-full bg-background">
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-4 py-4 border-b bg-background relative z-20">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold pr-8">
                {store ? "Edit Venue" : "Add New Venue"}
              </DialogTitle>
            </DialogHeader>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Content with proper mobile handling */}
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 overflow-y-auto overscroll-contain"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="px-4 py-4 space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                    id="store-form"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Venue Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter venue name"
                              {...field}
                              className="w-full h-12 text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter venue address"
                              {...field}
                              className="w-full h-12 text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resortId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Assign to Resort
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || "unassigned"}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-12">
                                <SelectValue placeholder="Select a resort (optional)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="unassigned">
                                <span className="text-gray-500">
                                  No resort assigned
                                </span>
                              </SelectItem>
                              {resorts.map((resort) => (
                                <SelectItem key={resort.id} value={resort.id}>
                                  {resort.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs text-gray-500">
                            You can assign this venue to a resort or leave
                            unassigned
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Location Description
                            <span className="text-xs text-gray-500 ml-1">
                              (Optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Pool bar is across the street, south of the building"
                              className="min-h-[100px] w-full resize-none text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500">
                            Help customers find your venue more easily with
                            specific location details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <FormLabel className="text-sm font-medium">
                        Venue Hours
                      </FormLabel>
                      <div className="space-y-4 rounded-lg border p-4 bg-gray-50">
                        {fields.map((item, index) => (
                          <div key={item.id} className="space-y-3">
                            <FormField
                              control={form.control}
                              name={`hours.${index}.isOpen`}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-base font-normal flex-1">
                                    {days[index]}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />

                            {form.watch(`hours.${index}.isOpen`) && (
                              <div className="flex items-center space-x-3 pl-6">
                                <FormField
                                  control={form.control}
                                  name={`hours.${index}.open`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input
                                          type="time"
                                          {...field}
                                          className="w-full h-12 text-base"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <span className="text-gray-500 text-lg">-</span>
                                <FormField
                                  control={form.control}
                                  name={`hours.${index}.close`}
                                  render={({ field }) => (
                                    <FormItem className="flex-1">
                                      <FormControl>
                                        <Input
                                          type="time"
                                          {...field}
                                          className="w-full h-12 text-base"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <FormLabel className="text-sm font-medium">
                        Venue Logo
                      </FormLabel>

                      <div className="space-y-4">
                        {customLogo ? (
                          <div className="relative w-24 h-24 mx-auto">
                            <div className="w-full h-full rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg ring-1 ring-black/5">
                              <img
                                src={customLogo}
                                alt="Venue logo preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleRemoveCustomLogo}
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full p-0"
                              disabled={isUploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-full">
                            <label
                              className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted active:bg-muted/80 transition-colors ${isUploading ? "pointer-events-none opacity-60" : ""}`}
                            >
                              <div className="flex flex-col items-center justify-center">
                                {isUploading ? (
                                  <>
                                    <Loader2 className="w-8 h-8 mb-2 text-muted-foreground animate-spin" />
                                    <p className="text-sm text-muted-foreground">
                                      Uploading...
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                      Upload logo image
                                    </p>
                                    <p className="text-xs text-muted-foreground/70">
                                      Max 5MB
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="bgColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Background Color
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-12">
                                <SelectValue placeholder="Select a color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colorOptions.map((color) => (
                                <SelectItem
                                  key={color.value}
                                  value={color.value}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-5 h-5 rounded ${color.value}`}
                                    ></div>
                                    <span className="text-base">
                                      {color.label}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bottom spacing for mobile keyboards and scrolling */}
                    <div className="h-32"></div>
                  </form>
                </Form>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div
            className="flex-shrink-0 border-t bg-background p-4 z-20"
            style={{
              paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="store-form"
                className="h-12 text-base"
              >
                {store ? "Update Venue" : "Create Venue"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
