import React from 'react';
import Box from '@/components/ui/box';
import { getters } from '@/lib/config/i18n';
import Link from 'next/link';

const LoginForm: React.FC = () => {
  const lang = 'en';
  const text = getters.geti18ns()[lang].login.form;

  return (
    <Box as="form" className="w-full max-w-md" onSubmit={e => e.preventDefault()}>
      <Box as="p" className="mb-4 text-[#808080]">
        {text.title}
      </Box>

      <Box as="label" htmlFor="email" className="block text-sm text-[#605D64] mb-1">
        {text.email}
      </Box>
      <Box
        as="input"
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        className="w-full p-3 rounded-md bg-white text-black mb-4"
        aria-label={text.email}
      />

      <Box as="label" htmlFor="password" className="block text-sm text-[#605D64] mb-1">
        {text.password}
      </Box>
      <Box
        as="input"
        id="password"
        name="password"
        type="password"
        placeholder="••••••••"
        required
        className="w-full p-3 rounded-md bg-white text-black mb-3"
        aria-label={text.password}
      />

      <Box className="flex items-center gap-2">
        <Box as="input" id="remember" type="checkbox" className="h-4 w-4" />
        <Box as="label" htmlFor="remember" className="text-sm text-[#605D64]">
          {text.remember}
        </Box>
      </Box>

      <Box className="mt-6 flex flex-col gap-3 items-center">
        <Box
          as="button"
          type="submit"
          className="w-full px-4 py-3 rounded-md bg-[#3b82f6] text-white font-medium"
        >
          {text.login}
        </Box>
        <Box
          as={Link}
          href="/"
          className="text-sm text-gray-400 hover:text-gray-200 transition"
          aria-label={text.back}
        >
          {text.back}
        </Box>
      </Box>
    </Box>
  );
};

export { LoginForm };
