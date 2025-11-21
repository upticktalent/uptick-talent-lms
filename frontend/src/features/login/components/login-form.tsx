import React from 'react';
import Box from '@/components/ui/box';
import { getters, LangKey } from '@/lib/config/i18n';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@radix-ui/react-label';
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

      {/* Email Field */}
      <div className="grid gap-2">
        <Label htmlFor="email">{text.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          disabled={isSubmitting}
          className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-red-500">{formik.errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="password">{text.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          disabled={isSubmitting}
          className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-sm text-red-500">{formik.errors.password}</p>
        )}
      </div>

      {/* Checkbox */}
      <div className="flex items-center space-x-2 mt-3">
        <Checkbox id="remember" />
        <Label
          htmlFor="remember"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {text.remember}
        </Label>
      </div>

      <Box className="mt-6 flex flex-col gap-3 items-center">
        <Button type="submit" className="w-full text-white" disabled={isSubmitting}>
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
