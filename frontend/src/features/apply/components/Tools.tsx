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
    { value: 'NEXT_JS', label: 'Next.js' },
    { value: 'TAILWIND_CSS', label: 'Tailwind CSS' },
    { value: 'OTHER', label: 'Other' },
  ],
  backend: [
    { value: 'NODE_JS', label: 'Node.js' },
    { value: 'PYTHON', label: 'Python (Django/Flask)' },
    { value: 'PHP', label: 'PHP (Laravel)' },
    { value: 'JAVA', label: 'Java (Spring)' },
    { value: 'GO', label: 'Go' },
    { value: 'OTHER', label: 'Other' },
  ],
  fullstack: [
    { value: 'REACT', label: 'React' },
    { value: 'NODE_JS', label: 'Node.js' },
    { value: 'NEXT_JS', label: 'Next.js' },
    { value: 'LARAVEL', label: 'Laravel' },
    { value: 'DJANGO', label: 'Django' },
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
      {values.track === Tracks.FRONTEND && (
        <Box>
          <FormCheckboxGroup
            name="frontendTools"
            options={toolOptions.frontend}
          />
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
          <FormCheckboxGroup
            name="fullstackTools"
            options={toolOptions.fullstack}
          />
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