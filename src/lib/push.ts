import webpush from 'web-push';
import { prisma } from './prisma';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
  webpush.setVapidDetails(
    'mailto:' + (process.env.ADMIN_EMAIL || 'admin@koreabridge.com'),
    publicVapidKey,
    privateVapidKey
  );
}

export async function sendPushNotification(userId: string, title: string, body: string, url: string = '/') {
  if (!publicVapidKey || !privateVapidKey) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  const payload = JSON.stringify({
    title,
    body,
    url,
    icon: '/logo.png',
  });

  const promises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        payload
      );
    } catch (err: any) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid
        await prisma.pushSubscription.delete({ where: { id: sub.id } });
      } else {
        console.error('Error sending push notification:', err);
      }
    }
  });

  await Promise.allSettled(promises);
}
