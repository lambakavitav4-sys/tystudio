import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AdSenseBanner() {
  const [adCode, setAdCode] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'adsense_code').single()
      .then(({ data }) => {
        if (data?.value) setAdCode(data.value);
      });
  }, []);

  if (!adCode) return null;

  return (
    <div className="w-full py-2 flex justify-center">
      <div dangerouslySetInnerHTML={{ __html: adCode }} />
    </div>
  );
}
