import React from 'react';
import Box from '@/components/ui/box';
import { Logo } from '@/components/common/logo';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className="min-h-screen flex flex-col">
      <Box
        as="header"
        className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex items-center justify-between bg-transparent"
      >
        <Logo width={140} variant="dark" />
      </Box>

      <main className="flex-1">{children}</main>
    </Box>
  );
}
