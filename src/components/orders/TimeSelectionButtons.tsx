
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeSelectionButtonsProps {
  selectedTime: number;
  onTimeSelect: (minutes: number) => void;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

export const TimeSelectionButtons = ({ 
  selectedTime, 
  onTimeSelect, 
  onAccept, 
  onReject, 
  showActions = false 
}: TimeSelectionButtonsProps) => {
  const timeOptions = [5, 10, 20];

  return (
    <div className="space-y-3">
      {/* Time Selection */}
      <div className="flex gap-2 justify-center">
        {timeOptions.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all ${
              selectedTime === time
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <span className="text-lg font-bold">{time}</span>
            <span className="text-xs">min</span>
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2">
          {onReject && (
            <Button
              variant="outline"
              onClick={onReject}
              className="flex-1 h-12 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300"
            >
              ✕
            </Button>
          )}
          {onAccept && (
            <Button
              onClick={onAccept}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Accept
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
