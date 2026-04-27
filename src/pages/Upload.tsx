import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload as UploadIcon, Music, Video } from 'lucide-react';
import { toast } from 'sonner';

export default function Upload() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile || !user) return;

    // Basic validation
    if (title.trim().length === 0 || title.length > 200) {
      toast.error('Title is required (max 200 chars)');
      return;
    }
    if (description.length > 2000) {
      toast.error('Description too long (max 2000 chars)');
      return;
    }
    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (mediaFile.size > maxSize) {
      toast.error('File too large (max 100 MB)');
      return;
    }

    setUploading(true);
    try {
      const mediaPath = `${user.id}/${Date.now()}-${mediaFile.name}`;
      const { error: vErr } = await supabase.storage.from('videos').upload(mediaPath, mediaFile);
      if (vErr) throw vErr;
      const { data: vUrl } = supabase.storage.from('videos').getPublicUrl(mediaPath);

      let thumbUrl: string | null = null;
      if (thumbnailFile) {
        const thumbPath = `${user.id}/${Date.now()}-${thumbnailFile.name}`;
        const { error: tErr } = await supabase.storage.from('thumbnails').upload(thumbPath, thumbnailFile);
        if (tErr) throw tErr;
        const { data: tUrl } = supabase.storage.from('thumbnails').getPublicUrl(thumbPath);
        thumbUrl = tUrl.publicUrl;
      }

      const { data: videoData, error: insErr } = await supabase
        .from('videos')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          video_url: vUrl.publicUrl,
          thumbnail_url: thumbUrl,
          uploaded_by: user.id,
        })
        .select()
        .single();
      if (insErr) throw insErr;

      // Notify subscribers (best-effort)
      if (videoData) {
        supabase.functions.invoke('send-push', {
          body: {
            title: '🎵 New Song: ' + title,
            body: description || 'A new song was just added!',
            videoId: videoData.id,
          },
        });
      }

      toast.success('Song uploaded!');
      navigate(`/watch/${videoData.id}`);
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center gap-3 mb-8 animate-slide-up">
          <UploadIcon className="w-7 h-7 text-primary" />
          <h1 className="font-display text-3xl font-bold text-gradient">Upload a Song</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 animate-scale-in space-y-5">
          {/* Media type toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMediaType('video')}
              className={`p-3 rounded-xl flex items-center gap-2 justify-center text-sm font-medium border transition-all ${
                mediaType === 'video'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Video className="w-4 h-4" /> Music Video
            </button>
            <button
              type="button"
              onClick={() => setMediaType('audio')}
              className={`p-3 rounded-xl flex items-center gap-2 justify-center text-sm font-medium border transition-all ${
                mediaType === 'audio'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
              }`}
            >
              <Music className="w-4 h-4" /> Audio Only
            </button>
          </div>

          <Input
            placeholder="Song title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
            className="bg-secondary border-border"
            required
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={2000}
            className="bg-secondary border-border"
            rows={3}
          />

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              {mediaType === 'video' ? 'Video file *' : 'Audio file *'} (max 100 MB)
            </label>
            <input
              type="file"
              accept={mediaType === 'video' ? 'video/*' : 'audio/*'}
              onChange={e => setMediaFile(e.target.files?.[0] ?? null)}
              className="text-sm text-muted-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Thumbnail / cover art (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setThumbnailFile(e.target.files?.[0] ?? null)}
              className="text-sm text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="bg-gradient-brand text-primary-foreground hover:opacity-90 w-full"
          >
            {uploading ? 'Uploading...' : 'Publish Song'}
          </Button>
        </form>
      </div>
    </div>
  );
}
