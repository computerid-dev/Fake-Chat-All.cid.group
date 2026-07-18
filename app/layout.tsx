import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Fake Chat [all] | by: CID-GROUP',
  description: 'Fake chat generator lengkap — WhatsApp, TikTok, IG Story, Kompas. Dibuat oleh Computer[ID]\u2022GROUP.',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/icons/icon-192.png',
    apple: '/images/icons/icon-180.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-50 min-h-screen" suppressHydrationWarning>{children}</body>
    </html>
  );
}
