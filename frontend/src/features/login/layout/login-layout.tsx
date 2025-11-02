'use client';

import Box from '@/components/ui/box';
import { LoginImage, Welcome, LoginForm } from '@/features/login';

const LoginLayout = () => {
  return (
    <Box className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Box className="w-full max-w-5xl overflow-hidden bg-[url('/images/auth-bg.png')] bg-cover bg-no-repeat bg-[#0b0b0f] grid grid-cols-1 md:grid-cols-2 shadow-lg">
        {/* Left - image section */}
        <LoginImage />
        {/* Right - dark panel, form section */}
        <Box className="w-full max-w-md p-8 md:p-12 flex flex-col items-center justify-center mx-auto">
          <Welcome />
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export { LoginLayout };
