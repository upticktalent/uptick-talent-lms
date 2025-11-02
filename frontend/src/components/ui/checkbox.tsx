import React from 'react';
import clsx from 'clsx';
import Box from '@/components/ui/box';
import { CheckboxProps } from '@/types/ui';

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  description,
  className,
  wrapperClassName,
  ...props
}) => {
  return (
    <Box className={clsx('flex items-start gap-2', wrapperClassName)}>
      <Box
        as="input"
        id={id}
        type="checkbox"
        className={clsx(
          'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
          className,
        )}
        {...props}
      />
      <Box as="label" htmlFor={id} className="text-sm text-[#605D64] leading-tight">
        {label}
        {description && <Box as="p" className="text-xs text-gray-500 mt-0.5">{description}</Box>}
      </Box>
    </Box>
  );
};

export default Checkbox;
