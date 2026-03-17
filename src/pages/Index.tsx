import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import VideoCard from '@/components/VideoCard';
import AdBanner from '@/components/AdBanner';
import NativeAdBanner from '@/components/NativeAdBanner';
import HighPerfAdBanner from '@/components/HighPerfAdBanner';
import { Music, Play, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';
import type { Tables } from '@/integrations/supabase/types';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Tables<'videos'>[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, 'like' | 'dislike'>>({});
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos(data ?? []);
    setLoading(false);
  };

  const fetchUserData = async () => {
    if (!user) return;
    const [favRes, reactRes] = await Promise.all([
      supabase.from('favorites').select('video_id').eq('user_id', user.id),
      supabase.from('video_reactions').select('video_id, reaction_type').eq('user_id', user.id),
    ]);
    setFavorites(new Set(favRes.data?.map(f => f.video_id) ?? []));
    const rMap: Record<string, 'like' | 'dislike'> = {};
    reactRes.data?.forEach(r => { rMap[r.video_id] = r.reaction_type as 'like' | 'dislike'; });
    setReactions(rMap);
  };

  useEffect(() => { fetchVideos(); }, []);
  useEffect(() => { fetchUserData(); }, [user]);

  const refresh = () => { fetchVideos(); fetchUserData(); };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="TY Studio" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative z-10 text-center px-4 animate-slide-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-brand mx-auto flex items-center justify-center mb-6 animate-float glow-primary">
            <Music className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-4">TY Studio</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto mb-8">
            Your premium destination for music videos. Watch, discover, and vibe.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!user && (
              <Button onClick={() => navigate('/auth')} className="bg-gradient-brand text-primary-foreground hover:opacity-90 h-12 px-8 font-semibold text-base">
                <Play className="w-5 h-5 mr-2" /> Get Started
              </Button>
            )}
            <Button variant="outline" onClick={() => document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' })} className="border-border text-foreground hover:bg-secondary h-12 px-8 font-semibold text-base">
              <TrendingUp className="w-5 h-5 mr-2" /> Browse Videos
            </Button>
          </div>
        </div>
      </section>

      <AdBanner />
      <NativeAdBanner />
      <HighPerfAdBanner />

      {/* Videos Grid */}
      <section id="videos" className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 animate-fade-in">
            🔥 Latest Videos
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground animate-fade-in">
              <Music className="w-20 h-20 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-display">No videos yet</p>
              <p className="text-sm mt-2">Videos will appear here once uploaded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((v, i) => (
                <div key={v.id} style={{ animationDelay: `${i * 0.1}s` }}>
                  <VideoCard
                    video={v}
                    isFavorited={favorites.has(v.id)}
                    userReaction={reactions[v.id] ?? null}
                    onUpdate={refresh}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-gradient">TY Studio</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} TY Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
