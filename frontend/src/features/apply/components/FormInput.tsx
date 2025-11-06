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
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
  FormInputProps & { children: React.ReactNode; placeholder?: string }
> = ({ name, label, children, placeholder, type, ...rest }) => {
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