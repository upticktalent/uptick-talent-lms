'use client';
import * as React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import Box from '@/components/ui/box';

interface FormPhoneNumberInputProps {
  name: string;
  label: string;
}

export const PhoneNumberInput: React.FC<FormPhoneNumberInputProps> = ({ name, label }) => {
  const { setFieldValue, values, setFieldTouched } = useFormikContext<any>();

  return (
    <Box className="mb-4">
      <Label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </Label>
      <PhoneInput
        id={name}
        name={name}
        value={values[name]}
        onChange={value => {
          setFieldValue(name, value);
        }}
        onBlur={() => {
          setFieldTouched(name, true);
        }}
        placeholder="Enter phone number"
        defaultCountry="NG"
      />
      <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-1" />
    </Box>
  );
};
