-- Create storage bucket for PDF menu uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-pdfs', 'menu-pdfs', true);

-- Create policies for PDF uploads
CREATE POLICY "Anyone can view menu PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'menu-pdfs');

CREATE POLICY "Anyone can upload menu PDFs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'menu-pdfs');

CREATE POLICY "Anyone can update menu PDFs" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'menu-pdfs');

CREATE POLICY "Anyone can delete menu PDFs" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'menu-pdfs');