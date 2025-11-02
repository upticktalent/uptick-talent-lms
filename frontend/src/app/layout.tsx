import type { Metadata } from 'next';
import { Geist_Mono, Raleway } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/providers';
import { Toaster } from 'sonner';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mentor Hub',
  description: 'A web-based mentorship platform for reasearch students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
