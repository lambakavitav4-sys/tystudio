import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ThumbsUp, ThumbsDown, Heart, Eye, ArrowLeft } from 'lucide-react';
import ShareButton from '@/components/ShareButton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import AdBanner from '@/components/AdBanner';
import CommentsSection from '@/components/CommentsSection';
import type { Tables } from '@/integrations/supabase/types';

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [video, setVideo] = useState<Tables<'videos'> | null>(null);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchVideo = async () => {
    if (!id) return;
    const { data } = await supabase.from('videos').select('*').eq('id', id).single();
    setVideo(data);
    setLoading(false);
  };

  const fetchUserData = async () => {
    if (!user || !id) return;
    const [reactionRes, favRes] = await Promise.all([
      supabase.from('video_reactions').select('reaction_type').eq('video_id', id).eq('user_id', user.id).maybeSingle(),
      supabase.from('favorites').select('id').eq('video_id', id).eq('user_id', user.id).maybeSingle(),
    ]);
    setUserReaction(reactionRes.data?.reaction_type ?? null);
    setIsFavorited(!!favRes.data);
  };

  const recordView = async () => {
    if (!id) return;
    await supabase.from('video_views').insert({ video_id: id, user_id: user?.id ?? null });
  };

  useEffect(() => { fetchVideo(); }, [id]);
  useEffect(() => { fetchUserData(); }, [user, id]);
  useEffect(() => { if (video) recordView(); }, [video?.id]);

  const getSessionId = () => {
    let sid = sessionStorage.getItem('anon_session');
    if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem('anon_session', sid); }
    return sid;
  };

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!id) return;

    if (user) {
      if (userReaction === type) {
        await supabase.from('video_reactions').delete().eq('video_id', id).eq('user_id', user.id);
      } else {
        await supabase.from('video_reactions').upsert(
          { video_id: id, user_id: user.id, reaction_type: type },
          { onConflict: 'video_id,user_id' }
        );
      }
    } else {
      // For anonymous users, just insert (no toggle)
      const sid = getSessionId();
      await supabase.from('video_reactions').insert({ video_id: id, user_id: sid, reaction_type: type });
    }
    fetchVideo();
    fetchUserData();
  };

  const handleFavorite = async () => {
    if (!user || !id) { toast.error('Please sign in to favorite'); return; }
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('video_id', id).eq('user_id', user.id);
      toast.success('Removed from favorites');
    } else {
      await supabase.from('favorites').insert({ video_id: id, user_id: user.id });
      toast.success('Added to favorites!');
    }
    fetchUserData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!video) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Video not found</div>;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-5xl animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="rounded-2xl overflow-hidden bg-card border border-border glow-primary mb-6">
          <div className="aspect-video">
            <video src={video.video_url} controls autoPlay className="w-full h-full object-contain bg-background" />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">{video.title}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" /> {video.views_count} views
            </span>
            <Button variant="ghost" size="sm" onClick={() => handleReaction('like')} className={userReaction === 'like' ? 'text-primary' : 'text-muted-foreground'}>
              <ThumbsUp className="w-4 h-4 mr-1" /> {video.likes_count}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleReaction('dislike')} className={userReaction === 'dislike' ? 'text-destructive' : 'text-muted-foreground'}>
              <ThumbsDown className="w-4 h-4 mr-1" /> {video.dislikes_count}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFavorite} className={isFavorited ? 'text-accent' : 'text-muted-foreground'}>
              <Heart className={`w-4 h-4 mr-1 ${isFavorited ? 'fill-current' : ''}`} /> Favorite
            </Button>
            <ShareButton videoId={video.id} title={video.title} />
          </div>
        </div>

        <CommentsSection videoId={video.id} />

        {video.description && (
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground text-sm whitespace-pre-line">{video.description}</p>
          </div>
        )}

        <AdBanner />
      </div>
    </div>
  );
}
