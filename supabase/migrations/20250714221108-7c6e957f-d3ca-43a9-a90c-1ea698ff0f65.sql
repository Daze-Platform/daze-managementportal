-- Add support for multiple resort assignments to employees
-- Add new column for multiple resorts (keeping old resort_id for backward compatibility temporarily)
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS assigned_resorts text[];

-- Migrate existing single resort_id values to the new array field
UPDATE public.employees 
SET assigned_resorts = ARRAY[resort_id]::text[]
WHERE resort_id IS NOT NULL AND assigned_resorts IS NULL;

-- Create index for better performance on array queries
CREATE INDEX IF NOT EXISTS idx_employees_assigned_resorts ON public.employees USING GIN(assigned_resorts);