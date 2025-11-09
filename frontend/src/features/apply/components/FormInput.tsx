import Box from '@/components/ui/box';
import { Field, ErrorMessage, FieldProps } from 'formik';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  as?: string;
  placeholder?: string;
}

// Basic reusable Input Field
export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  ...rest
}) => {
  return (
    <Box className="mb-4">
      <Label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </Label>
      <Field
        id={name}
        name={name}
        type={type}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
        )}
        {...rest}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </Box>
  );
};

// Basic reusable Select Field
export const FormSelect: React.FC<
  FormInputProps & { children: React.ReactNode; placeholder?: string; disabled?: boolean; }
> = ({ name, label, children, placeholder, type, disabled, ...rest }) => {
  return (
    <Box className="mb-4">
      <Label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </Label>
      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <Select
            name={field.name}
            value={field.value}
            onValueChange={value => {
              form.setFieldValue(field.name, value);
            }}
            disabled={disabled}
          >
            <SelectTrigger id={name} className="w-full" {...rest}>
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </Box>
  );
};

// Basic reusable Checkbox Group
export const FormCheckboxGroup: React.FC<{ name: string; options: { value: string; label: string }[]; }> = ({
  name,
  options,
}) => {
  return (
    <Box role="group" aria-labelledby={`${name}-group-label`} className="mb-4">
      <Field name={name}>
        {({ field }: FieldProps) => (
          <Box className="grid grid-cols-2 gap-2">
            {options.map(option => (
              <Label key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  {...field}
                  checked={field.value.includes(option.value)}
                  onCheckedChange={checked => {
                    const { value } = field;
                    const newValue = checked
                      ? [...value, option.value]
                      : value.filter((v: string) => v !== option.value);
                    field.onChange({ target: { name, value: newValue } });
                  }}
                  className="rounded"
                />
                
                <Box as="span">{option.label}</Box>
                
              </Label>
            ))}
          </Box>
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </Box>
  );
};