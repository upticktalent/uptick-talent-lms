import React from 'react';
import Box from '@/components/ui/box';
import { getters, LangKey } from '@/lib/config/i18n';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppSelector } from '@/redux';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '@/lib/api/auth';
import { toast } from 'sonner';
import type { LoginFormValues } from '@/types/auth';
import { useFormHandler } from '@/hooks/useFormHandler';
import { loginSchema } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { storeCookie, env } from '@/lib';
import { getErrorMessage } from '@/utils';

const LoginForm: React.FC = () => {
  const router = useRouter();
  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const text = getters.geti18ns()[lang].login.form;

  // 1. Setup React Query Mutation
  const { mutateAsync } = useMutation({
    mutationFn: loginUser,
    onSuccess: response => {
      if (response.code === 200) {
        toast.success(response.message || 'Login successful');

        // Store the token
        storeCookie({ key: env.AUTH_TOKEN, value: response.payload.token });

        // Redirect based on role
        const userRole = response.payload.user.role;
        if (userRole === 'ADMIN') {
          router.push('/dashboard');
        } else if (userRole === 'STUDENT') {
          router.push('/student/dashboard');
        }
      } else {
        throw new Error(response.message);
      }
    },
    onError: error => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  const formik = useFormHandler<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async values => {
      await mutateAsync(values);
    },
  });

  const { isSubmitting } = formik;

  return (
    <Box as="form" className="w-full max-w-md" onSubmit={formik.handleSubmit}>
      <Box as="p" className="mb-4 text-[#808080]">
        {text.title}
      </Box>

      <Input
        id="email"
        name="email"
        type="email"
        label={text.email}
        placeholder="you@example.com"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
        disabled={isSubmitting}
      />

      <Box className="mt-4" />

      <Input
        id="password"
        name="password"
        type="password"
        label={text.password}
        placeholder="••••••••"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        error={
          formik.touched.password && formik.errors.password ? formik.errors.password : undefined
        }
        disabled={isSubmitting}
      />

      <Checkbox id="remember" label={text.remember} wrapperClassName="mt-3" />

      <Box className="mt-6 flex flex-col gap-3 items-center">
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : text.login}
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
