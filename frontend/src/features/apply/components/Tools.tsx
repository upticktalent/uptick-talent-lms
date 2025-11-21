import React from 'react';
import { useFormikContext } from 'formik';
import { ApplicationFormData, Tracks } from '@/types/apply';
import { FormCheckboxGroup, FormInput } from './FormInput';
import Box from '@/components/ui/box';

const toolOptions = {
  frontend: [
    { value: 'REACT', label: 'React' },
    { value: 'VUE', label: 'Vue' },
    { value: 'ANGULAR', label: 'Angular' },
    { value: 'SVELTE', label: 'Svelte' },
    { value: 'OTHER', label: 'Other' },
  ],
  backend: [
    { value: 'NODE', label: 'Node' },
    { value: 'EXPRESS', label: 'Express' },
    { value: 'DJANGO', label: 'Django' },
    { value: 'FASTAPI', label: 'FastAPI' },
    { value: 'LARAVEL', label: 'Laravel' },
    { value: 'OTHER', label: 'Other' },
  ],
  fullstack: [
    { value: 'REACT', label: 'React' },
    { value: 'NODE', label: 'Node' },
    { value: 'ANGULAR', label: 'Angular' },
    { value: 'DJANGO', label: 'Django' },
    { value: 'LARAVEL', label: 'Laravel' },
    { value: 'OTHER', label: 'Other' },
  ],
  mobile: [
    { value: 'FLUTTER', label: 'Flutter' },
    { value: 'REACT_NATIVE', label: 'React Native' },
    { value: 'KOTLIN', label: 'Kotlin' },
    { value: 'SWIFT', label: 'Swift' },
    { value: 'OTHER', label: 'Other' },
  ],
};

export const Tools = () => {
  const { values } = useFormikContext<ApplicationFormData>();

  return (
    <Box>
      {/* --- 2. Track-Specific Tools/Proficiency --- */}
      {values.track === Tracks.FRONTEND && (
        <Box>
          <FormCheckboxGroup name="frontendTools" options={toolOptions.frontend} />
          <FormInput name="frontendToolsOther" label="Other (please specify)" />
        </Box>
      )}
      {values.track === Tracks.BACKEND && (
        <Box>
          <FormCheckboxGroup name="backendTools" options={toolOptions.backend} />
          <FormInput name="backendToolsOther" label="Other (please specify)" />
        </Box>
      )}
      {values.track === Tracks.FULLSTACK && (
        <Box>
          <FormCheckboxGroup name="fullstackTools" options={toolOptions.fullstack} />
          <FormInput name="fullstackToolsOther" label="Other (please specify)" />
        </Box>
      )}
      {values.track === Tracks.MOBILE && (
        <Box>
          <FormCheckboxGroup name="mobileTools" options={toolOptions.mobile} />
          <FormInput name="mobileToolsOther" label="Other (please specify)" />
        </Box>
      )}
    </Box>
  );
};
