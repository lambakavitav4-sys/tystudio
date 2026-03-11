import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  video_id: string;
  user_id: string | null;
  guest_name: string | null;
  content: string;
  created_at: string;
}

export default function CommentsSection({ videoId }: { videoId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: false });
    setComments((data as Comment[]) ?? []);
  };

  useEffect(() => { fetchComments(); }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const insertData: Record<string, unknown> = {
      video_id: videoId,
      content: content.trim(),
    };

    if (user) {
      insertData.user_id = user.id;
      insertData.guest_name = user.user_metadata?.display_name || user.email || 'User';
    } else {
      insertData.guest_name = guestName.trim() || 'Anonymous';
    }

    const { error } = await supabase.from('comments').insert(insertData as never);
    if (error) {
      toast.error('Failed to post comment');
    } else {
      setContent('');
      setGuestName('');
      fetchComments();
      toast.success('Comment posted!');
    }
    setLoading(false);
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="mt-6 glass rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        Comments ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        {!user && (
          <Input
            placeholder="Your name (optional)"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="bg-secondary/50 border-border"
          />
        )}
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-secondary/50 border-border min-h-[80px] resize-none"
        />
        <Button type="submit" disabled={loading || !content.trim()} size="sm" className="bg-gradient-brand text-primary-foreground">
          <Send className="w-4 h-4 mr-1" /> Post
        </Button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="border-b border-border/50 pb-3 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {(c.guest_name || 'A')[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">{c.guest_name || 'Anonymous'}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-9">{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
