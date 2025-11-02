import React from 'react';
import Box from '@/components/ui/box';
import clsx from 'clsx';
import { ButtonProps } from '@/types/ui';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  isLoading,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex justify-center items-center rounded-md font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-700 text-white hover:bg-gray-800',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <Box
      as="button"
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </Box>
  );
};

export default Button;
