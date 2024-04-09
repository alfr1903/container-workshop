import type { Metadata } from 'next';
import { Ubuntu } from 'next/font/google';

const ubuntu = Ubuntu({ weight: '500', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechCollEDGE Next course',
  description:
    'Netlight TechCollEDGE NextJS x ChatGPT course. Create a ChatGPT powered recipe generator.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={ubuntu.className}>{children}</body>
    </html>
  );
}
