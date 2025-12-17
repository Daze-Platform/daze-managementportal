-- Create resorts table
CREATE TABLE public.resorts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  manager TEXT,
  status TEXT DEFAULT 'active',
  store_count INTEGER DEFAULT 0,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create stores table
CREATE TABLE public.stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  location_description TEXT,
  logo TEXT DEFAULT '🏪',
  custom_logo TEXT,
  bg_color TEXT DEFAULT 'bg-blue-500',
  active_orders INTEGER DEFAULT 0,
  hours JSONB,
  resort_id TEXT REFERENCES public.resorts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create policies (public read for now since no auth is implemented)
CREATE POLICY "Anyone can view resorts" ON public.resorts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert resorts" ON public.resorts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update resorts" ON public.resorts FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete resorts" ON public.resorts FOR DELETE USING (true);

CREATE POLICY "Anyone can view stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stores" ON public.stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update stores" ON public.stores FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete stores" ON public.stores FOR DELETE USING (true);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_resorts_updated_at
  BEFORE UPDATE ON public.resorts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();