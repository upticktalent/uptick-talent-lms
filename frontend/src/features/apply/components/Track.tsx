import React from 'react';
import { ErrorMessage, Field, FieldProps } from 'formik';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tracks } from '@/types/apply';

const stackOptions = [
  { value: Tracks.FRONTEND, label: 'Frontend Engineering' },
  { value: Tracks.BACKEND, label: 'Backend Engineering' },
  { value: Tracks.FULLSTACK, label: 'Fullstack Engineering' },
  { value: Tracks.MOBILE, label: 'Mobile Engineering' },
];

export const Track = () => {
  return (
    <Box>
      <Box as="p" className="mb-4">
        Which track are you applying for?
      </Box>

      <Field name="track">
        {({ field, form }: FieldProps) => (
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={value => {
              form.setFieldValue(field.name, value);
            }}
            className="space-y-3"
          >
            {stackOptions.map(option => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  'flex items-center justify-between p-4 border rounded-lg cursor-pointer',
                  field.value === option.value
                    ? 'border-primary bg-accent ring-2 ring-ring'
                    : 'border-border'
                )}
              >
                <Box as="span" className="font-medium">
                  {option.label}
                </Box>
                <RadioGroupItem value={option.value} id={option.value} />
              </Label>
            ))}
          </RadioGroup>
        )}
      </Field>

      <ErrorMessage name="track" component="div" className="text-red-600 text-sm mt-2" />
    </Box>
  );
};
