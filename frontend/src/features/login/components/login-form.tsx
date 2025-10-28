import React from 'react';
import Box from '@/components/ui/box';
import { getters, LangKey } from '@/lib/config/i18n';
import Link from 'next/link';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/checkbox';
import { useAppSelector } from '@/redux';

const LoginForm: React.FC = () => {
  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const text = getters.geti18ns()[lang].login.form;

  return (
    <Box as="form" className="w-full max-w-md" onSubmit={e => e.preventDefault()}>
      <p className="mb-4 text-[#808080]">{text.title}</p>

      <Input
        id="email"
        name="email"
        type="email"
        label={text.email}
        placeholder="you@example.com"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label={text.password}
        placeholder="••••••••"
        required
        className="mt-4"
      />

      <Checkbox id="remember" label={text.remember} wrapperClassName="mt-3" />

      <Box className="mt-6 flex flex-col gap-3 items-center">
        <Button type="submit" fullWidth>
          {text.login}
        </Button>

        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-200 transition"
          aria-label={text.back}
        >
          {text.back}
        </Link>
      </Box>
    </Box>
  );
};

export { LoginForm };
