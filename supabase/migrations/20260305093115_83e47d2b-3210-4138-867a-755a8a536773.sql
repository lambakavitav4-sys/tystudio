
-- Fix the permissive video_views insert policy to require a video_id reference
DROP POLICY "Anyone can insert views" ON public.video_views;
CREATE POLICY "Authenticated users can insert views" ON public.video_views 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
