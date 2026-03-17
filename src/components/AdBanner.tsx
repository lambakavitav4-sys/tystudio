import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AdBanner() {
  const [adCode, setAdCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      const { data: networkData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'active_ad_network')
        .maybeSingle();

      const activeNetwork = networkData?.value ?? 'adsense';

      const keyMap: Record<string, string> = {
        adsense: 'adsense_code',
        medianet: 'medianet_code',
        custom: 'custom_ad_code',
      };

      const settingKey = keyMap[activeNetwork];
      if (!settingKey) return;

      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', settingKey)
        .maybeSingle();

      if (data?.value) setAdCode(data.value);
    };

    fetchAd();
  }, []);

  if (!adCode) return null;

  return (
    <div className="w-full py-2 flex justify-center">
      <div dangerouslySetInnerHTML={{ __html: adCode }} />
    </div>
  );
}
