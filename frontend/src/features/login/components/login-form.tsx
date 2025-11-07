import React from 'react';
import Box from '@/components/ui/box';
import { getters, LangKey } from '@/lib/config/i18n';
import Link from 'next/link';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/checkbox';
import { useAppSelector } from '@/redux';
import type { LoginFormValues } from '@/types/auth';
import { useFormHandler } from '@/hooks/useFormHandler';
import { loginSchema } from '@/lib/utils';
import { client } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { urls } from '@/lib/config/constants';

const LoginForm: React.FC = () => {
  const lang = useAppSelector(state => state.settings.lang) as LangKey;
  const text = getters.geti18ns()[lang].login.form;

  const router = useRouter();

  const formik = useFormHandler<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await client.post(urls.LOGIN, values);
        console.log('Login successful:', response.data);
        resetForm();
        setTimeout(() => router.push('/dashboard'), 1000);
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setSubmitting(false);
      }
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
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        placeholder="you@example.com"
        error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
      />

      <Box className="mt-4" />

      <Input
        id="password"
        name="password"
        type="password"
        label={text.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
        placeholder="••••••••"
        error={
          formik.touched.password && formik.errors.password ? formik.errors.password : undefined
        }
      />

      <Checkbox id="remember" label={text.remember} wrapperClassName="mt-3" />

      <Box className="mt-6 flex flex-col gap-3 items-center">
        <Button type="submit" fullWidth>
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
