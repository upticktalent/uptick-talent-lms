'use client';

import React from 'react';
import { Formik, Form } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ApplicationFormData } from '@/types/apply';
import { validationSchemas } from '@/schema/apply';
import { useAutoSave, getSavedDraft, clearSavedDraft } from '@/hooks/apply/useAutoSave';
import { useMultiStepForm } from '@/hooks/apply/useMultiStepForm';

import { client } from '@/lib/api';
import { getErrorMessage } from '@/utils/errors';
import { urls } from '@/lib';
import { getters } from '@/lib/config/i18n';
import Box from '@/components/ui/box';

import { StepIndicator } from './components/StepIndicator';
import { FormControls } from './components/FormControls';
import { PersonalInfo } from './components/PersonalInfo';
import { Track } from './components/Track';
import { Tools } from './components/Tools';
import { Referral } from './components/Referral';
import { Review } from './components/Review';
import { SuccessModal } from './components/SuccessModal';

const i18n = getters.geti18ns().en.apply;

// --- Form and Step Definitions ---

const defaultInitialValues: ApplicationFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: null,
  country: '',
  state: '',
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

interface LocationData {
  iso2: string;
  name: string;
}

// --- Main Application Form Component ---
export const ApplicationForm = () => {
  const { currentStep, nextStep, prevStep, goToStep, isFirstStep, isLastStep } = useMultiStepForm(
    steps.length,
  );

  const queryClient = useQueryClient();

  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  // Load draft from local storage
  const [initialValues] = React.useState(getSavedDraft() || defaultInitialValues);

  // TanStack Query mutation for form submission
  const { mutateAsync } = useMutation({
    mutationFn: (data: ApplicationFormData) => {
      const countryOptions =
        queryClient.getQueryData<LocationData[]>(['countries'])?.map(c => ({
          value: c.iso2,
          label: c.name,
        })) || [];
      const stateOptions =
        queryClient.getQueryData<LocationData[]>(['states', data.country])?.map(s => ({
          value: s.iso2,
          label: s.name,
        })) || [];

      const countryLabel =
        countryOptions.find(o => o.value === data.country)?.label || data.country;
      const stateLabel = stateOptions.find(o => o.value === data.state)?.label || data.state;

      const payload: Record<string, unknown> = {
        ...data,
        country: countryLabel,
        state: stateLabel,
        frontendToolsOther: data.frontendToolsOther ? [data.frontendToolsOther] : [],
        backendToolsOther: data.backendToolsOther ? [data.backendToolsOther] : [],
        fullstackToolsOther: data.fullstackToolsOther ? [data.fullstackToolsOther] : [],
        mobileToolsOther: data.mobileToolsOther ? [data.mobileToolsOther] : [],
        referralSourceOther: data.referralSourceOther ? [data.referralSourceOther] : [],
      };

      delete payload.fullstackTools;
      delete payload.fullstackToolsOther;

      return client.post(urls.APPLY, payload);
    },
    onSuccess: () => {
      setShowSuccessModal(true);
      clearSavedDraft();
    },
    onError: error => {
      toast.error(getErrorMessage(error, i18n.toast.error));
    },
  });

  const handleSubmit = async (
    values: ApplicationFormData,
    actions: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    if (!isLastStep) {
      nextStep();
      actions.setSubmitting(false);
      return;
    }

    try {
      await mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  };

  const currentValidationSchema = validationSchemas[currentStep - 1];

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={currentValidationSchema}
      onSubmit={handleSubmit}
      validateOnMount={true}
    >
      {({ isSubmitting, isValid, values }) => (
        <Form>
          <AutoSaveHandler />

          <StepIndicator currentStep={currentStep} steps={steps} goToStep={goToStep} />

          <Box className="p-6 md:p-8 border rounded-lg shadow-sm bg-card">
            {steps[currentStep - 1].component}
          </Box>

          <FormControls
            onBack={prevStep}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
            isValid={isValid}
          />

          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            email={values.email}
          />
        </Form>
      )}
    </Formik>
  );
};
