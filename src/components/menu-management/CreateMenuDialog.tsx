import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Sparkles } from 'lucide-react';

interface CreateMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (option: string) => void;
}

export const CreateMenuDialog: React.FC<CreateMenuDialogProps> = ({ 
  open, 
  onOpenChange, 
  onContinue 
}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleContinue = () => {
    if (selectedOption) {
      onContinue(selectedOption);
      setSelectedOption('');
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedOption('');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-base font-semibold">
            Create menu
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-2">
          {/* From scratch option */}
          <button
            onClick={() => setSelectedOption('scratch')}
            className={`w-full flex items-start gap-3 p-4 rounded-lg text-left transition-colors border ${
              selectedOption === 'scratch' 
                ? 'border-foreground bg-muted' 
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">
                Start from scratch
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Create a blank menu and add your own items
              </div>
            </div>
          </button>

          {/* Template option */}
          <button
            onClick={() => setSelectedOption('sample')}
            className={`w-full flex items-start gap-3 p-4 rounded-lg text-left transition-colors border ${
              selectedOption === 'sample' 
                ? 'border-foreground bg-muted' 
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">
                Use a template
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Start with sample items you can customize
              </div>
            </div>
          </button>
        </div>

        <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
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
