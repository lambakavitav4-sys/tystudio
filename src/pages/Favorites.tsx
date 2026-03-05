import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import VideoCard from '@/components/VideoCard';
import { Heart } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

export default function Favorites() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Tables<'videos'>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    const { data: favs } = await supabase.from('favorites').select('video_id').eq('user_id', user.id);
    if (favs && favs.length > 0) {
      const ids = favs.map(f => f.video_id);
      const { data } = await supabase.from('videos').select('*').in('id', ids).order('created_at', { ascending: false });
      setVideos(data ?? []);
    } else {
      setVideos([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchFavorites(); }, [user]);

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8 animate-slide-up">
          <Heart className="w-7 h-7 text-accent" />
          <h1 className="font-display text-3xl font-bold text-foreground">Your Favorites</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground animate-fade-in">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No favorites yet. Start adding videos you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map(v => (
              <VideoCard key={v.id} video={v} isFavorited onUpdate={fetchFavorites} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
