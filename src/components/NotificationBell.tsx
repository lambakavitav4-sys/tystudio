import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string | null;
  video_id: string | null;
  created_at: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState<string>(() => localStorage.getItem('notif_last_seen') || '');
  const navigate = useNavigate();

  const unseenCount = notifications.filter(n => n.created_at > lastSeen).length;

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setNotifications(data as Notification[]);
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      const now = new Date().toISOString();
      setLastSeen(now);
      localStorage.setItem('notif_last_seen', now);
    }
  };

  const handleClick = (n: Notification) => {
    setOpen(false);
    if (n.video_id) navigate(`/watch/${n.video_id}`);
  };

  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
        <Bell className="w-5 h-5" />
        {unseenCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto glass rounded-xl border border-border shadow-xl z-50 animate-scale-in">
            <div className="p-3 border-b border-border">
              <h3 className="font-display font-semibold text-sm text-foreground">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-muted-foreground">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left p-3 hover:bg-secondary/50 transition-colors border-b border-border/30 ${
                    n.created_at > lastSeen ? 'bg-primary/5' : ''
                  }`}
                >
                  <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                  {n.message && <p className="text-xs text-muted-foreground mt-0.5 truncate">{n.message}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleDateString()} · {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
