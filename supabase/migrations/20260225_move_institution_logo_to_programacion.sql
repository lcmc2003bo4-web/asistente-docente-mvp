-- Move institucion and logo_url to programaciones
ALTER TABLE public.programaciones 
ADD COLUMN institucion text,
ADD COLUMN logo_url text;

-- Create storage bucket for logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for the logos bucket
-- Allow public access to read logos
CREATE POLICY "Logos are publicly accessible." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'logos' );

-- Allow authenticated users to upload logos
CREATE POLICY "Users can upload their own logos." 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'logos' AND auth.role() = 'authenticated' );

-- Allow users to update their own logos
CREATE POLICY "Users can update their own logos."
ON storage.objects FOR UPDATE
USING ( bucket_id = 'logos' AND auth.role() = 'authenticated' );

-- Allow users to delete their own logos
CREATE POLICY "Users can delete their own logos."
ON storage.objects FOR DELETE
USING ( bucket_id = 'logos' AND auth.role() = 'authenticated' );
