import type { Metadata } from 'next';
import { Geist_Mono, Raleway } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/providers';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import Box from '@/components/ui/box';
import { ModeToggle } from '@/components/mode-toggle';

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
  description: 'A web-based mentorship platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box as="html" lang="en" suppressHydrationWarning>
      <Box as="body" className={`${raleway.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            {/* Global Toggle - visible on all routes */}
            <Box className="fixed bottom-4 right-4 z-50">
              <ModeToggle />
            </Box>

            {children}

            <Toaster position="top-right" />
          </AppProvider>
        </ThemeProvider>
      </Box>
    </Box>
  );
}
