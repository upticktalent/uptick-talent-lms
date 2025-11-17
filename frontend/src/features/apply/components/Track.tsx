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
  { value: Tracks.DATA_SCIENCE, label: 'Data Science' },
  { value: Tracks.MACHINE_LEARNING, label: 'Machine Learning' },
  { value: Tracks.DATA_ANALYSIS, label: 'Data Analysis' },
  { value: Tracks.DATA_ENGINEERING, label: 'Data Engineering' },
  { value: Tracks.UI_DESIGN, label: 'UI Design' },
  { value: Tracks.UX_DESIGN, label: 'UX Design' },
  { value: Tracks.GRAPHICS_DESIGN, label: 'Graphics Design' },
  { value: Tracks.UX_RESEARCH, label: 'UX Research' },
  { value: Tracks.PROJECT_PRODUCT_MANAGEMENT, label: 'Project/Product Management' },
  { value: Tracks.PRODUCT_MARKETING_MANAGEMENT, label: 'Product Marketing Management' },
  { value: Tracks.OPERATIONS, label: 'Operations' },
  { value: Tracks.SALES, label: 'Sales' },
  { value: Tracks.BUSINESS_DEVELOPMENT, label: 'Business Development' },
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
