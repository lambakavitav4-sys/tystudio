import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function SocialBarAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    (window as any).atOptions = {
      key: 'a3c288c36b65439e8a3e64171857d384',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/a3c288c36b65439e8a3e64171857d384/invoke.js';
    containerRef.current.appendChild(script);
  }, []);

  const wrapperClass = isMobile
    ? 'fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center bg-background/90 backdrop-blur-sm border-t border-border py-1'
    : 'fixed left-2 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2';

  return (
    <div className={wrapperClass}>
      <span className="text-[10px] text-muted-foreground mb-1">Advertisement</span>
      <div ref={containerRef} style={{ width: 300, height: 250, maxWidth: '100%' }} />
    </div>
  );
}
