import React from 'react';
import { useFormikContext } from 'formik';
import { ApplicationFormData } from '@/types/apply'; 
import { FormInput, FormCombobox } from './FormInput';
import Box from '@/components/ui/box';

const referralOptions = [
  { value: 'TWITTER', label: 'Twitter (X)' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'FRIEND', label: 'From a Friend' },
  { value: 'OTHER', label: 'Other' },
];

export const Referral = () => {
  const { values } = useFormikContext<ApplicationFormData>();

  return (
    <Box>
      <FormCombobox
        name="referralSource"
        label="How did you hear about us?"
        options={referralOptions}
        placeholder="Select an option"
      />

      {values.referralSource === 'OTHER' && (
        <FormInput
          name="referralSourceOther"
          label="Please specify"
          placeholder="e.g., A blog post"
        />
      )}

    </Box>
  );
};