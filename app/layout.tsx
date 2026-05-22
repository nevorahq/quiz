import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import PostHogProvider from './providers/PostHogProvider';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEVORA Quiz',
  description: 'Product discovery quiz for VIDA — Personal Life OS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary font-body">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
