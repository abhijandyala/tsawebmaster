import type { Metadata } from 'next';
import { DM_Sans, Source_Serif_4 } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'Charlotte Connect | Local Community Resources',
  description: 'Find trusted community resources in the Charlotte area. Charlotte Connect helps residents of Charlotte, Lake Norman, Huntersville, Matthews, Concord, and surrounding areas find local support, services, and opportunities.',
  keywords: ['Charlotte resources', 'Charlotte NC', 'Lake Norman', 'Huntersville', 'Matthews', 'community resources', 'local services', 'food assistance', 'housing help', 'healthcare'],
  authors: [{ name: 'Charlotte Connect' }],
  openGraph: {
    title: 'Charlotte Connect | Local Community Resources',
    description: 'Find trusted community resources in the Charlotte area. Connecting Charlotte residents to local support, services, and opportunities.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${sourceSerif.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
