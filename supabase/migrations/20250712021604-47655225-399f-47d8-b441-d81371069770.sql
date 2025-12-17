-- Ensure the menu-pdfs storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-pdfs', 'menu-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the menu-pdfs bucket
CREATE POLICY "Anyone can upload PDFs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'menu-pdfs');

CREATE POLICY "Anyone can view PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-pdfs');

CREATE POLICY "Anyone can delete PDFs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'menu-pdfs');