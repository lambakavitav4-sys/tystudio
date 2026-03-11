
-- Comments table for anonymous and logged-in users
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id uuid,
  guest_name text DEFAULT 'Anonymous',
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read comments
CREATE POLICY "Comments viewable by everyone"
  ON public.comments FOR SELECT
  TO public
  USING (true);

-- Anyone (including anon) can insert comments
CREATE POLICY "Anyone can insert comments"
  ON public.comments FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Make video_views allow anonymous inserts (user_id is already nullable)
CREATE POLICY "Anonymous users can insert views"
  ON public.video_views FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous reactions
CREATE POLICY "Anonymous users can manage reactions"
  ON public.video_reactions FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
