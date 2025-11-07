'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApplicationFormData } from './types';
import { validationSchemas } from '@/schema/apply';
import { useAutoSave, getSavedDraft, clearSavedDraft } from '@/hooks/apply/useAutoSave';
import { useMultiStepForm } from '@/hooks/apply/useMultiStepForm';

import { client } from '@/lib/api'; 
import { getErrorMessage } from '@/utils/errors'; 
import { urls } from '@/lib';
import Box from '@/components/ui/box';

import { StepIndicator } from './components/StepIndicator';
import { FormControls } from './components/FormControls';
import { PersonalInfo } from './components/PersonalInfo';
import { Track } from './components/Track';
import { Tools } from './components/Tools';
import { Referral } from './components/Referral';
import { Review } from './components/Review';

// --- Form and Step Definitions ---

const defaultInitialValues: ApplicationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  city: '',
  track: '',
  frontendTools: [],
  frontendToolsOther: '',
  backendTools: [],
  backendToolsOther: '',
  fullstackTools: [],
  fullstackToolsOther: '',
  mobileTools: [],
  mobileToolsOther: '',
    referralSource: '',
  referralSourceOther: '',
  confirm: false,
};

interface Step {
  title: string;
  description: string;
  component: React.ReactNode;
}

const steps: Step[] = [
  {
    title: 'Personal Information',
    description: "Let's get to know you.",
    component: <PersonalInfo />,
  },
  {
    title: 'Track Selection',
    description: 'Choose your desired learning path.',
    component: <Track />,
  },
  {
    title: 'Tools & Experience',
    description: 'Tell us about the tools you use.',
    component: <Tools />,
  },
  {
    title: 'Referral & Discovery',
    description: 'How did you find us?',
    component: <Referral />,
  },
  {
    title: 'Review & Submit',
    description: 'Confirm your details and submit.',
    component: <Review />,
  },
];

// --- Helper component to enable auto-save ---
const AutoSaveHandler = () => {
  useAutoSave();
  return null;
};

// --- Main Application Form Component ---
export const ApplicationForm = () => {
  const {
    currentStep,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
  } = useMultiStepForm(steps.length);

  // Load draft from local storage
  const [initialValues] = React.useState(
    getSavedDraft() || defaultInitialValues
  );

  // TanStack Query mutation for form submission
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ApplicationFormData) => {
      const payload: any = {
        ...data,
        frontendToolsOther: data.frontendToolsOther
          ? [data.frontendToolsOther]
          : [],
        backendToolsOther: data.backendToolsOther
          ? [data.backendToolsOther]
          : [],
        fullstackToolsOther: data.fullstackToolsOther
          ? [data.fullstackToolsOther]
          : [],
        mobileToolsOther: data.mobileToolsOther
          ? [data.mobileToolsOther]
          : [],
      };

      return client.post(urls.APPLY, payload);
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      clearSavedDraft();
      // TODO: Redirect to a thank you page
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Submission failed. Please try again.'));
    },
  });

  const handleSubmit = (
    values: ApplicationFormData,
    actions: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!isLastStep) {
      nextStep();
      actions.setSubmitting(false);
      return;
    }

    // This is the final submission
    mutate(values);
  };

  const currentValidationSchema = validationSchemas[currentStep - 1];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={currentValidationSchema}
      onSubmit={handleSubmit}
      validateOnMount={true}
    >
      {({ isSubmitting, isValid }) => (
        <Form>
          <AutoSaveHandler /> {/* Attach auto-save hook */}
          
          <StepIndicator currentStep={currentStep} steps={steps} />

          <Box className="p-6 md:p-8 border rounded-lg shadow-sm bg-white">
            {steps[currentStep - 1].component}
          </Box>

          <FormControls
            onBack={prevStep}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting || isPending}
            isValid={isValid}
          />
        </Form>
      )}
    </Formik>
  );
};