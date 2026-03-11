import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Heart, Eye, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

interface VideoCardProps {
  video: Tables<'videos'>;
  isFavorited?: boolean;
  userReaction?: 'like' | 'dislike' | null;
  onUpdate?: () => void;
}

export default function VideoCard({ video, isFavorited = false, userReaction = null, onUpdate }: VideoCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);

  const handleReaction = async (type: 'like' | 'dislike', e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      if (userReaction === type) {
        await supabase.from('video_reactions').delete().eq('video_id', video.id).eq('user_id', user.id);
      } else {
        await supabase.from('video_reactions').upsert(
          { video_id: video.id, user_id: user.id, reaction_type: type },
          { onConflict: 'video_id,user_id' }
        );
      }
    } else {
      const sid = sessionStorage.getItem('anon_session') || (() => { const s = crypto.randomUUID(); sessionStorage.setItem('anon_session', s); return s; })();
      await supabase.from('video_reactions').insert({ video_id: video.id, user_id: sid, reaction_type: type });
    }
    onUpdate?.();
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { toast.error('Please sign in'); return; }

    if (isFavorited) {
      await supabase.from('favorites').delete().eq('video_id', video.id).eq('user_id', user.id);
      toast.success('Removed from favorites');
    } else {
      await supabase.from('favorites').insert({ video_id: video.id, user_id: user.id });
      toast.success('Added to favorites!');
    }
    onUpdate?.();
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div
      className="group cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:glow-primary animate-scale-in"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate(`/watch/${video.id}`)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-brand opacity-30 flex items-center justify-center">
            <Play className="w-12 h-12 text-foreground/50" />
          </div>
        )}
        <div className={`absolute inset-0 bg-background/60 flex items-center justify-center transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center animate-pulse-glow">
            <Play className="w-7 h-7 text-primary-foreground ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-sm text-foreground truncate mb-2">{video.title}</h3>
        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{video.description}</p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <button onClick={(e) => handleReaction('like', e)} className={`flex items-center gap-1 transition-colors hover:text-primary ${userReaction === 'like' ? 'text-primary' : ''}`}>
              <ThumbsUp className="w-3.5 h-3.5" /> {video.likes_count}
            </button>
            <button onClick={(e) => handleReaction('dislike', e)} className={`flex items-center gap-1 transition-colors hover:text-destructive ${userReaction === 'dislike' ? 'text-destructive' : ''}`}>
              <ThumbsDown className="w-3.5 h-3.5" /> {video.dislikes_count}
            </button>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {formatViews(video.views_count)}
            </span>
          </div>
          <button onClick={handleFavorite} className={`transition-colors hover:text-accent ${isFavorited ? 'text-accent' : ''}`}>
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
