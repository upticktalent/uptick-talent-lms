import React from 'react';
import Box from '@/components/ui/box';
import clsx from 'clsx';
import { InputProps } from '@/types/ui';

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  wrapperClassName,
  className,
  id,
  ...props
}) => {
  return (
    <Box className={clsx('w-full flex flex-col', wrapperClassName)}>
      {label && (
        <Box as="label" htmlFor={id} className="text-sm text-[#605D64] mb-1">
          {label}
        </Box>
      )}

      <Box
        as="input"
        id={id}
        className={clsx(
          'w-full p-3 rounded-md bg-white text-black placeholder:text-gray-400 border',
          error ? 'border-red-500' : 'border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          className,
        )}
        {...props}
      />

      {error && <Box as="p" className="text-sm text-red-500 mt-1">{error}</Box>}
      {!error && helperText && <Box as="p" className="text-xs text-gray-500 mt-1">{helperText}</Box>}
    </Box>
  );
};

export default Input;
