import type { Metadata } from 'next';
import { Space_Grotesk, DM_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: 'EVNT | Plataforma Corporativa',
  description: 'Conectamos empresas con los mejores restaurantes para eventos corporativos. Sin llamadas. Sin cotizaciones. Sin perder tiempo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-bg text-text-primary selection:bg-accent selection:text-black">
        {children}
      </body>
    </html>
  );
}
