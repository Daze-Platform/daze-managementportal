import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sparkles, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (option: string) => void;
}

export const CreateMenuDialog: React.FC<CreateMenuDialogProps> = ({
  open,
  onOpenChange,
  onContinue,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const isMobile = useIsMobile();

  const handleContinue = () => {
    if (selectedOption) {
      onContinue(selectedOption);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedOption("");
    }
    onOpenChange(isOpen);
  };

  const options = [
    {
      id: "scratch",
      icon: Sparkles,
      title: "Start from scratch",
      description: "Create a blank menu and build it your way.",
    },
    {
      id: "sample",
      icon: FileText,
      title: "Use a template",
      description: "Start with a pre-built menu template.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`${
          isMobile
            ? "w-full max-w-none h-full max-h-none m-0 rounded-none"
            : "sm:max-w-md"
        } p-0 gap-0`}
      >
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Create Menu
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Choose how you'd like to get started.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 space-y-2">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            const Icon = option.icon;

            return (
              <motion.button
                key={option.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground">
                      {option.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/30">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!selectedOption}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
