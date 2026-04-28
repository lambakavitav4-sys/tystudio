import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Upload, Users, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'users' | 'videos'>('upload');
  const [users, setUsers] = useState<Tables<'profiles'>[]>([]);
  const [videos, setVideos] = useState<Tables<'videos'>[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate('/');
  }, [authLoading, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchVideos();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data ?? []);
  };

  const fetchVideos = async () => {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    setVideos(data ?? []);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile || !user) return;
    setUploading(true);

    try {
      const videoPath = `${Date.now()}-${videoFile.name}`;
      const { error: vErr } = await supabase.storage.from('videos').upload(videoPath, videoFile);
      if (vErr) throw vErr;

      const { data: vUrl } = supabase.storage.from('videos').getPublicUrl(videoPath);
      let thumbUrl = null;

      if (thumbnailFile) {
        const thumbPath = `${Date.now()}-${thumbnailFile.name}`;
        await supabase.storage.from('thumbnails').upload(thumbPath, thumbnailFile);
        const { data: tUrl } = supabase.storage.from('thumbnails').getPublicUrl(thumbPath);
        thumbUrl = tUrl.publicUrl;
      }

      const { data: videoData } = await supabase.from('videos').insert({
        title,
        description,
        video_url: vUrl.publicUrl,
        thumbnail_url: thumbUrl,
        uploaded_by: user.id,
      }).select().single();

      // Send notifications (in-app + push)
      if (videoData) {
        supabase.functions.invoke('send-push', {
          body: {
            title: '🎵 New Video: ' + title,
            body: description || 'A new music video has been uploaded!',
            videoId: videoData.id,
          },
        });
      }

      toast.success('Video uploaded!');
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
      fetchVideos();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    await supabase.from('videos').delete().eq('id', videoId);
    toast.success('Video deleted');
    fetchVideos();
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const tabs = [
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'videos' as const, label: 'Videos', icon: Video },
    { id: 'users' as const, label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-3 mb-8 animate-slide-up">
          <Shield className="w-7 h-7 text-primary" />
          <h1 className="font-display text-3xl font-bold text-gradient">Admin Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap animate-fade-in">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-brand text-primary-foreground'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <form onSubmit={handleUpload} className="glass rounded-2xl p-8 max-w-2xl animate-scale-in space-y-5">
            <h2 className="font-display text-xl font-semibold text-foreground">Upload Music Video</h2>
            <Input placeholder="Video title" value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary border-border" required />
            <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="bg-secondary border-border" rows={3} />
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Video File *</label>
              <input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files?.[0] ?? null)} className="text-sm text-muted-foreground" required />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Thumbnail (optional)</label>
              <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] ?? null)} className="text-sm text-muted-foreground" />
            </div>
            <Button type="submit" disabled={uploading} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </form>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="animate-scale-in space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">All Videos ({videos.length})</h2>
            {videos.map(v => (
              <div key={v.id} className="glass rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {v.thumbnail_url && <img src={v.thumbnail_url} alt="" className="w-20 h-12 rounded-lg object-cover" />}
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.views_count} views · {v.likes_count} likes</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteVideo(v.id)} className="text-destructive hover:text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {videos.length === 0 && <p className="text-muted-foreground text-center py-10">No videos uploaded yet.</p>}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="animate-scale-in space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Registered Users ({users.length})</h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 text-foreground">{u.display_name ?? 'Unknown'}</td>
                      <td className="p-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div className="glass rounded-2xl p-8 max-w-2xl animate-scale-in space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Ad Network Management</h2>
            <p className="text-sm text-muted-foreground">Choose your ad network and paste the code. Only the active network's ads will be shown on your site.</p>

            {/* Network Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Active Ad Network</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'adsense', label: 'Google AdSense', desc: 'Best for established sites' },
                  { id: 'medianet', label: 'Media.net', desc: 'Yahoo/Bing contextual ads' },
                  { id: 'custom', label: 'Custom HTML', desc: 'Any ad code snippet' },
                ].map(net => (
                  <button
                    key={net.id}
                    onClick={() => setActiveAdNetwork(net.id)}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      activeAdNetwork === net.id
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium text-sm">{net.label}</p>
                    <p className="text-xs opacity-70">{net.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Code inputs */}
            {activeAdNetwork === 'adsense' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Google AdSense Code</label>
                <p className="text-xs text-muted-foreground">Sign up at <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">adsense.google.com</a></p>
                <Textarea placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>...' value={adCodes.adsense_code} onChange={e => setAdCodes(c => ({ ...c, adsense_code: e.target.value }))} className="bg-secondary border-border font-mono text-xs" rows={5} />
              </div>
            )}
            {activeAdNetwork === 'medianet' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Media.net Code</label>
                <p className="text-xs text-muted-foreground">Sign up at <a href="https://www.media.net" target="_blank" rel="noopener noreferrer" className="text-primary underline">media.net</a> — contextual ads powered by Yahoo/Bing.</p>
                <Textarea placeholder="Paste your Media.net ad code here..." value={adCodes.medianet_code} onChange={e => setAdCodes(c => ({ ...c, medianet_code: e.target.value }))} className="bg-secondary border-border font-mono text-xs" rows={5} />
              </div>
            )}
            {activeAdNetwork === 'custom' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Custom Ad HTML</label>
                <p className="text-xs text-muted-foreground">Paste any HTML/JS ad code from any network.</p>
                <Textarea placeholder="<div>Your ad code here...</div>" value={adCodes.custom_ad_code} onChange={e => setAdCodes(c => ({ ...c, custom_ad_code: e.target.value }))} className="bg-secondary border-border font-mono text-xs" rows={5} />
              </div>
            )}

            <Button onClick={handleSaveAds} className="bg-gradient-brand text-primary-foreground hover:opacity-90">
              Save Ad Settings
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
