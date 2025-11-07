import Box from '@/components/ui/box';
import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <Box className="mb-8">
      {/* Step Titles */}
      <Box as="h2" className="text-2xl font-semibold">
        {steps[currentStep - 1].title}
      </Box>
      <Box as="p" className="text-gray-600 mt-1">
        {steps[currentStep - 1].description}
      </Box>

      <Box className="mt-6">
        <Box className="flex items-center">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <React.Fragment key={step.title}>
                <Box
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0',
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700',
                  )}
                >
                  {isCompleted ? '✓' : stepNumber}
                </Box>

                {stepNumber < steps.length && (
                  <Box className={cn('flex-1 h-1', isCompleted ? 'bg-green-500' : 'bg-gray-200')} />
                )}
              </React.Fragment>
            );
          })}
        </Box>

        <Box className="flex items-start mt-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;

            return (
              <React.Fragment key={step.title}>
                <Box
                  as="span"
                  className={cn(
                    'w-8 text-center text-xs',
                    isActive ? 'font-bold' : 'text-gray-500',
                  )}
                >
                  {step.title.split(' ')[0]}
                </Box>

                {stepNumber < steps.length && <Box className="flex-1" />}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
