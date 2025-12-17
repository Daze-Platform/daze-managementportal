-- Create menus table
CREATE TABLE public.menus (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  resort_id TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create promotions table
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  resort_id TEXT,
  conditions JSONB DEFAULT '{}'::jsonb,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Create policies for menus
CREATE POLICY "Anyone can view menus" 
ON public.menus 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create menus" 
ON public.menus 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update menus" 
ON public.menus 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete menus" 
ON public.menus 
FOR DELETE 
USING (true);

-- Create policies for promotions
CREATE POLICY "Anyone can view promotions" 
ON public.promotions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create promotions" 
ON public.promotions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update promotions" 
ON public.promotions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete promotions" 
ON public.promotions 
FOR DELETE 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_menus_updated_at
BEFORE UPDATE ON public.menus
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
BEFORE UPDATE ON public.promotions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();