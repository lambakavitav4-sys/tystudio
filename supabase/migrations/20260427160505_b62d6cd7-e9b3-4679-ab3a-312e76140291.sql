-- Allow any authenticated user to upload songs (videos or audio)
CREATE POLICY "Authenticated users can insert videos"
ON public.videos
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- Allow uploaders to delete their own uploads
CREATE POLICY "Users can delete their own videos"
ON public.videos
FOR DELETE
TO authenticated
USING (auth.uid() = uploaded_by);

-- Storage policies for the videos bucket - allow authenticated uploads
CREATE POLICY "Authenticated users can upload to videos bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload to thumbnails bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'thumbnails');
