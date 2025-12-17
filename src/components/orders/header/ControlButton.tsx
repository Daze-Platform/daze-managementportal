
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface ControlButtonProps {
  storeStatus: 'open' | 'closed';
  orderStatus: 'active' | 'paused';
  onClick: () => void;
  className?: string;
}

export const ControlButton = ({ storeStatus, orderStatus, onClick, className }: ControlButtonProps) => {
  const getButtonVariant = () => {
    if (storeStatus === 'closed') return 'default';
    if (orderStatus === 'paused') return 'default';
    return 'destructive';
  };

  const getButtonText = () => {
    if (storeStatus === 'closed') return 'Start';
    if (orderStatus === 'paused') return 'Resume';
    return 'Pause';
  };

  const getButtonIcon = () => {
    if (storeStatus === 'closed' || orderStatus === 'paused') return Play;
    return Pause;
  };

  const ButtonIcon = getButtonIcon();

  return (
    <Button
      variant={getButtonVariant()}
      onClick={onClick}
      size="sm"
      className={className}
    >
      <ButtonIcon className="w-3 h-3 mr-1" />
      {getButtonText()}
    </Button>
  );
};
