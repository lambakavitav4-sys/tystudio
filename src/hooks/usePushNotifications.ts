import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePushNotifications() {
  useEffect(() => {
    registerServiceWorker();
  }, []);
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    
    // Check if already subscribed
    const existing = await registration.pushManager.getSubscription();
    if (existing) return;

    // Subscribe (without VAPID for simplified approach - works with some push services)
    const subscription = await registration.pushManager.subscribe({
      userGracefullyDegrades: true,
      applicationServerKey: undefined,
    } as any);

    if (!subscription) return;

    const json = subscription.toJSON();
    
    await supabase.from('push_subscriptions').upsert({
      endpoint: json.endpoint!,
      p256dh: json.keys?.p256dh || '',
      auth_key: json.keys?.auth || '',
    }, { onConflict: 'endpoint' });
  } catch (err) {
    // Push not supported or permission denied - silently fail
    console.log('Push notifications not available:', err);
  }
}
