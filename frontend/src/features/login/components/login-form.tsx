import React, { useState } from 'react';
import Box from '@/components/ui/box';
import { getters, LangKey } from '@/lib/config/i18n';
import Link from 'next/link';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/checkbox';
import { useAppSelector } from '@/redux';
import { useMutation } from '@tanstack/react-query';
import { loginUser, LoginPayload } from '@/lib/api/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { storeCookie, env } from '@/lib';
import { getErrorMessage } from '@/utils';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const text = getters.geti18ns()[lang].login.form;

  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: response => {
      if (response.code === 200) {
        toast.success(response.message || 'Login successful');

        // 1. Store the token
        storeCookie({ key: env.AUTH_TOKEN, value: response.payload.token });

        const userRole = response.payload.user.role;

        if (userRole === 'ADMIN') {
          router.push('/dashboard');
        } else {
          router.push('/lms/home');
        }
      } else {
        toast.error(response.message);
      }
    },
    onError: error => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <Box as="form" className="w-full max-w-md" onSubmit={handleSubmit}>
      <p className="mb-4 text-[#808080]">{text.title}</p>

      <Input
        id="email"
        name="email"
        type="email"
        label={text.email}
        placeholder="you@example.com"
        required
        value={formData.email}
        onChange={handleChange}
        disabled={isPending}
      />

      <Input
        id="password"
        name="password"
        type="password"
        label={text.password}
        placeholder="••••••••"
        required
        className="mt-4"
        value={formData.password}
        onChange={handleChange}
        disabled={isPending}
      />

      <Checkbox id="remember" label={text.remember} wrapperClassName="mt-3" />

      <Box className="mt-6 flex flex-col gap-3 items-center">
        <Button type="submit" fullWidth isLoading={isPending} disabled={isPending}>
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
