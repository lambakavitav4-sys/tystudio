import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Web Push utilities using Web Crypto API (no npm dependency needed)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function sendWebPush(subscription: any, payload: string, vapidKeys: { publicKey: string; privateKey: string }) {
  const endpoint = subscription.endpoint;
  const p256dh = subscription.keys.p256dh;
  const auth = subscription.keys.auth;

  // For simplicity, we'll use fetch to send to the push service
  // In production, you'd use proper VAPID signing
  // Here we use a simplified approach
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'TTL': '86400',
    },
    body: payload,
  });

  return response;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { title, body, videoId } = await req.json();

    // Create in-app notification
    await supabase.from('notifications').insert({
      title,
      message: body,
      video_id: videoId,
    });

    // Get all push subscriptions
    const { data: subscriptions } = await supabase.from('push_subscriptions').select('*');

    const payload = JSON.stringify({
      title,
      body,
      url: videoId ? `/watch/${videoId}` : '/',
    });

    // Send push to each subscription
    let sent = 0;
    let failed = 0;
    
    if (subscriptions) {
      for (const sub of subscriptions) {
        try {
          const pushSub = {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth_key },
          };
          
          const res = await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
              'TTL': '86400',
            },
            body: payload,
          });

          if (res.ok || res.status === 201) {
            sent++;
          } else if (res.status === 404 || res.status === 410) {
            // Subscription expired, remove it
            await supabase.from('push_subscriptions').delete().eq('id', sub.id);
            failed++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, failed, inAppCreated: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
