
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface DeclineOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDecline: (reason: string) => void;
  orderId: string;
}

export const DeclineOrderDialog = ({ isOpen, onClose, onDecline, orderId }: DeclineOrderDialogProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Out of stock items',
    'Kitchen capacity exceeded',
    'Delivery area not covered',
    'Payment issue',
    'Store closing early',
    'Technical issue',
    'Other'
  ];

  const handleDecline = () => {
    const reason = selectedReason === 'Other' ? customReason : selectedReason;
    if (reason.trim()) {
      onDecline(reason);
      // Reset form
      setSelectedReason('');
      setCustomReason('');
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setCustomReason('');
    onClose();
  };

  const isSubmitDisabled = !selectedReason || (selectedReason === 'Other' && !customReason.trim());

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Decline Order #{orderId}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please select a reason for rejecting this order. This will help improve our service and notify the customer appropriately.
          </p>

          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            <div className="space-y-3">
              {predefinedReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason} id={reason} />
                  <Label htmlFor={reason} className="text-sm font-medium cursor-pointer">
                    {reason}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {selectedReason === 'Other' && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason" className="text-sm font-medium">
                Please specify the reason:
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Enter custom reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDecline}
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              Decline Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
