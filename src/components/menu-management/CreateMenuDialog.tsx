import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sparkles, FileText, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (option: string) => void;
}

export const CreateMenuDialog: React.FC<CreateMenuDialogProps> = ({ open, onOpenChange, onContinue }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const isMobile = useIsMobile();

  const handleContinue = () => {
    if (selectedOption) {
      onContinue(selectedOption);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedOption('');
    }
    onOpenChange(isOpen);
  };

  const options = [
    {
      id: 'scratch',
      icon: Sparkles,
      title: 'Start from scratch',
      description: 'Create a blank menu and build it exactly the way you want.',
      features: ['Full customization', 'Your own structure']
    },
    {
      id: 'sample',
      icon: FileText,
      title: 'Use a template',
      description: 'Start with a professionally designed menu template.',
      features: ['25+ sample items', 'Ready to customize']
    }
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${
        isMobile 
          ? 'w-full max-w-none h-full max-h-none m-0 rounded-none' 
          : 'sm:max-w-lg'
      } p-0 gap-0`}>
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Create a new menu
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mt-1">
            Choose how you'd like to get started.
          </p>
        </div>

        {/* Options */}
        <div className="px-6 pb-6 space-y-3">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            const Icon = option.icon;
            
            return (
              <motion.div
                key={option.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedOption(option.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                  isSelected 
                    ? 'border-foreground bg-foreground/5' 
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">
                        {option.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {option.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {option.features.map((feature, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'border-foreground bg-foreground' 
                      : 'border-muted-foreground/30'
                  }`}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-3 h-3 text-background" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleContinue}
            disabled={!selectedOption}
            className="bg-foreground hover:bg-foreground/90 text-background gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
