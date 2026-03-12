
-- Notifications table for in-app notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text,
  video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Everyone can read notifications
CREATE POLICY "Notifications viewable by everyone"
  ON public.notifications FOR SELECT
  TO public
  USING (true);

-- Only admins can insert notifications
CREATE POLICY "Admins can manage notifications"
  ON public.notifications FOR ALL
  TO public
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Push subscriptions table
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a subscription
CREATE POLICY "Anyone can subscribe to push"
  ON public.push_subscriptions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read own sub (by endpoint)
CREATE POLICY "Anyone can read subscriptions"
  ON public.push_subscriptions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can delete own subscription
CREATE POLICY "Anyone can unsubscribe"
  ON public.push_subscriptions FOR DELETE
  TO anon, authenticated
  USING (true);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
