-- Create employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  store TEXT,
  assigned_stores TEXT[], -- For runners who can be assigned to multiple stores
  status TEXT NOT NULL DEFAULT 'Active',
  avatar TEXT,
  resort_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create policies for employees access
CREATE POLICY "Anyone can view employees" 
ON public.employees 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update employees" 
ON public.employees 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete employees" 
ON public.employees 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();