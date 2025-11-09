import React from 'react';
import { useFormikContext } from 'formik';
import { ApplicationFormData } from '@/types/apply';
import { FormInput, FormSelect } from './FormInput';
import Box from '@/components/ui/box';
import { SelectItem } from '@/components/ui/select';

export const Referral = () => {
  const { values } = useFormikContext<ApplicationFormData>();

  return (
    <Box>
      <FormSelect name="referralSource" label="How did you hear about us?">
        <SelectItem value="TWITTER">Twitter (X)</SelectItem>
        <SelectItem value="LINKEDIN">LinkedIn</SelectItem>
        <SelectItem value="INSTAGRAM">Instagram</SelectItem>
        <SelectItem value="FACEBOOK">Facebook</SelectItem>
        <SelectItem value="FRIEND">From a Friend</SelectItem>
        <SelectItem value="OTHER">Other</SelectItem>
      </FormSelect>

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