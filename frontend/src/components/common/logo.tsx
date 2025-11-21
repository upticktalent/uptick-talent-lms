'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

export interface LogoProps {
  linkTo?: string;
  className?: string;
  width?: number;
  clickable?: boolean;
  variant?: 'light' | 'dark'; // Explicitly defined here
}

const Logo: React.FC<LogoProps> = ({
  linkTo = '/',
  className = '',
  width = 120,
  clickable = true,
  variant = 'light',
}) => {
  const logoElement = (
    <Image
      src="/uptick-logo.svg"
      alt="UPTICK TALENT Logo"
      width={width}
      height={29}
      className={cn(
        variant === 'light' ? 'bg-white p-2 rounded-sm' : 'brightness-0 invert',
        className,
      )}
      priority
    />
  );

  return clickable ? <Link href={linkTo}>{logoElement}</Link> : <Box>{logoElement}</Box>;
};

export { Logo };
