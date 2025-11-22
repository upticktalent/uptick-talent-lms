'use client';

import Box from '@/components/ui/box';
import { LoginImage, Welcome, LoginForm } from '@/features/login';
import { Logo } from '@/components/common/logo';

const LoginLayout = () => {
  return (
    <Box className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Box className="w-full max-w-5xl overflow-hidden bg-[url('/images/auth-bg.png')] bg-cover bg-no-repeat bg-[#0b0b0f] grid grid-cols-1 md:grid-cols-2 shadow-lg">
        <LoginImage />
        <Box className="w-full max-w-md p-8 md:p-12 flex flex-col items-center justify-center mx-auto">
          <Logo className="mb-4 md:mb-0 md:invisible rounded-sm" />
          <Welcome />
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export { LoginLayout };
