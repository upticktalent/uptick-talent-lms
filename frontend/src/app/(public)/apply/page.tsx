import { ApplicationForm } from '@/features/apply';
import Box from '@/components/ui/box';
import React from 'react';

const ApplicationPage = () => {
  return (
    <Box className="container mx-auto max-w-4xl p-4 pt-24 md:p-8 md:pt-32">
      <ApplicationForm />
    </Box>
  );
};

export default ApplicationPage;
