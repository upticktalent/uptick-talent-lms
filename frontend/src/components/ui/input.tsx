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
        <label htmlFor={id} className="text-sm text-[#605D64] mb-1">
          {label}
        </label>
      )}

      <input
        id={id}
        className={clsx(
          'w-full p-3 rounded-md bg-white text-black placeholder:text-gray-400 border',
          error ? 'border-red-500' : 'border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          className,
        )}
        {...props}
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </Box>
  );
};

export default Input;
