import { useState } from 'react';
import { Share2, Copy, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  videoId: string;
  title: string;
  className?: string;
  iconOnly?: boolean;
}

const platforms = [
  { name: 'WhatsApp', icon: '💬', getUrl: (url: string, title: string) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}` },
  { name: 'Twitter / X', icon: '𝕏', getUrl: (url: string, title: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
  { name: 'Facebook', icon: '📘', getUrl: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  { name: 'Telegram', icon: '✈️', getUrl: (url: string, title: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  { name: 'Reddit', icon: '🔴', getUrl: (url: string, title: string) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  { name: 'LinkedIn', icon: '💼', getUrl: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { name: 'Email', icon: '📧', getUrl: (url: string, title: string) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check this out: ' + url)}` },
];

export default function ShareButton({ videoId, title, className = '', iconOnly = false }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoUrl = `${window.location.origin}/watch/${videoId}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleOpen}
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
        {!iconOnly && <span className="text-sm">Share</span>}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute bottom-full mb-2 right-0 z-50 w-56 rounded-xl border border-border bg-card shadow-lg p-3 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">Share</span>
              <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={(e) => handleShare(p.getUrl(videoUrl, title), e)}
                  className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-muted transition-colors"
                  title={p.name}
                >
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">{p.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-xs text-foreground"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="truncate flex-1 text-left">{videoUrl}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
