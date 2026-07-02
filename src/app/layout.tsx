import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'KoreaBridge - Learn Korean & Visit Busan',
  description: 'Learn Korean with a native teacher in Busan.',
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
          </div>
        </Providers>
      </body>
    </html>
  );
}
