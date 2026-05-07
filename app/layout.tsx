import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'K-Logic',
  description: 'Retro Math Challenge OS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body suppressHydrationWarning className="font-rajdhani selection:bg-neon-magenta selection:text-white">
        <div className="fixed inset-0 bg-[#0a0a1a] -z-50" />
        {children}
        <div className="scanline" />
      </body>
    </html>
  );
}
