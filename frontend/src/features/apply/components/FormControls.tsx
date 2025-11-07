import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFormikContext } from 'formik';
import React from 'react';

interface FormControlsProps {
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

export const FormControls: React.FC<FormControlsProps> = ({
  onBack,
  isFirstStep,
  isLastStep,
  isSubmitting,
  isValid,
}) => {
  const { touched } = useFormikContext();
  const isStepValid = isValid || Object.keys(touched).length === 0;

  return (
    <Box className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
      >
        Previous
      </Button>

      <Button
        type="submit"
        disabled={!isStepValid || isSubmitting}
        className={cn(
          isLastStep ? 'bg-[#477BFF] hover:bg-[#477BFF]/90 text-white' : 'bg-primary hover:bg-primary/90',
          (!isStepValid || isSubmitting) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting
          ? 'Submitting...'
          : isLastStep
            ? 'Submit Application'
            : 'Next'}
      </Button>
    </Box>
  );
};