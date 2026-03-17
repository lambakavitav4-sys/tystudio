import { useEffect, useRef } from 'react';

export default function HighPerfAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    // Set atOptions on window
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

  return (
    <div className="w-full py-4 flex justify-center overflow-hidden">
      <div ref={containerRef} />
    </div>
  );
}
