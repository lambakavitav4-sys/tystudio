
-- Function to update views_count on videos when a view is inserted
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.videos SET views_count = views_count + 1 WHERE id = NEW.video_id;
  RETURN NEW;
END;
$$;

-- Trigger on video_views insert
CREATE TRIGGER on_video_view_inserted
  AFTER INSERT ON public.video_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_view_count();

-- Function to recalculate like/dislike counts
CREATE OR REPLACE FUNCTION public.update_reaction_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_video_id uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_video_id := OLD.video_id;
  ELSE
    target_video_id := NEW.video_id;
  END IF;

  UPDATE public.videos SET
    likes_count = (SELECT count(*) FROM public.video_reactions WHERE video_id = target_video_id AND reaction_type = 'like'),
    dislikes_count = (SELECT count(*) FROM public.video_reactions WHERE video_id = target_video_id AND reaction_type = 'dislike')
  WHERE id = target_video_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger on video_reactions insert/update/delete
CREATE TRIGGER on_reaction_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.video_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reaction_counts()
