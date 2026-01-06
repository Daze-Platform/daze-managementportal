import * as React from "react"
import { cn } from "@/lib/utils"

interface PriceInputProps extends Omit<React.ComponentProps<"input">, 'onChange' | 'value'> {
  value: number | string;
  onChange: (value: number) => void;
}

const PriceInput = React.forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    // Format the display value - remove leading zeros for whole numbers
    const formatDisplayValue = (val: number | string): string => {
      if (val === '' || val === 0) return '';
      const numVal = typeof val === 'string' ? parseFloat(val) : val;
      if (isNaN(numVal)) return '';
      // Convert to string and remove leading zeros
      return numVal.toString();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty input
      if (inputValue === '') {
        onChange(0);
        return;
      }
      
      // Parse the value as a float
      const numValue = parseFloat(inputValue);
      
      // Only update if it's a valid number
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    };

    return (
      <input
        type="number"
        step="0.01"
        min="0"
        value={formatDisplayValue(value)}
        onChange={handleChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background transition-all duration-200 ease-smooth file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary/50 hover:border-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
PriceInput.displayName = "PriceInput"

export { PriceInput }
