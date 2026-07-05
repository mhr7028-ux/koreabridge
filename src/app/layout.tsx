import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Providers from '@/components/Providers';
import SNSOnboardingModal from '@/components/SNSOnboardingModal';
import PushNotificationManager from '@/components/PushNotificationManager';

export const metadata: Metadata = {
  title: 'KoreaBridge - Learn Korean & Visit Busan',
  description: 'Learn Korean with a native teacher in Busan.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="app-container">
            <Header />
            <main className="app-main">
              {children}
            </main>
            <SNSOnboardingModal />
            <PushNotificationManager />
          </div>
        </Providers>
      </body>
    </html>
  );
}
