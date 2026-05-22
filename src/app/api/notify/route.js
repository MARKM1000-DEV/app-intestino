export const runtime = 'nodejs';

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_MAILTO,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*');

  if (!subscriptions?.length) return Response.json({ sent: 0 });

  const today = new Date().toISOString().split('T')[0];
  let sent = 0;

  for (const sub of subscriptions) {
    const { data: logs } = await supabase
      .from('logs')
      .select('id')
      .eq('user_id', sub.user_id)
      .gte('created_at', `${today}T00:00:00`)
      .limit(1);

    if (logs?.length) continue;

    try {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({
          title: 'Saúde Intestinal 💩',
          body: 'Não esqueça de registrar sua saúde hoje!',
        })
      );
      sent++;
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
    }
  }

  return Response.json({ sent });
}
