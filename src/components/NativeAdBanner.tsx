import { useEffect, useRef } from 'react';

export default function NativeAdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !containerRef.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28933386.effectivegatecpm.com/541224be2902bed12e13af6324a3f2a6/invoke.js';
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full py-4 flex justify-center overflow-hidden">
      <div className="w-full max-w-3xl">
        <div id="container-541224be2902bed12e13af6324a3f2a6" ref={containerRef} />
      </div>
    </div>
  );
}
