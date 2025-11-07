import React from 'react';
import { useFormikContext, Field, ErrorMessage } from 'formik';
import { ApplicationFormData, Tracks } from '../types';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

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

const allToolOptions = [
  ...toolOptions.frontend,
  ...toolOptions.backend,
  ...toolOptions.fullstack,
  ...toolOptions.mobile,
];
const toolDisplayMap = new Map(allToolOptions.map(opt => [opt.value, opt.label]));

// Helper component to display a summary item
const SummaryItem: React.FC<{ label: string; value: React.ReactNode; capitalize?: boolean; }> = ({
  label,
  value,
  capitalize = true,
}) => (
  <Box className="mb-3 py-3">
    <Box as="dt" className="text-sm font-medium text-gray-500">
      {label}
    </Box>
    <Box as="dd" className={cn(
        'mt-1 text-base font-semibold',
        capitalize && 'capitalize'
      )}>
      {value || 'N/A'}
    </Box>
  </Box>
);

// Helper maps to format values for display
const trackDisplayNames: Record<Tracks | '', string> = {
  '': 'N/A',
  [Tracks.FRONTEND]: 'Frontend Engineering',
  [Tracks.BACKEND]: 'Backend Engineering',
  [Tracks.FULLSTACK]: 'Fullstack Engineering',
  [Tracks.MOBILE]: 'Mobile Engineering',
};

const referralSourceDisplayNames: Record<string, string> = {
  TWITTER: 'Twitter (X)',
  LINKEDIN: 'LinkedIn',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  FRIEND: 'From a Friend',
  OTHER: 'Other',
};

export const Review = () => {
  const { values } = useFormikContext<ApplicationFormData>();
  const { track } = values;

  let tools: string[] = [];
  let otherTools: string = '';

  if (track === Tracks.FRONTEND) {
    tools = values.frontendTools;
    otherTools = values.frontendToolsOther;
  } else if (track === Tracks.BACKEND) {
    tools = values.backendTools;
    otherTools = values.backendToolsOther;
  } else if (track === Tracks.FULLSTACK) {
    tools = values.fullstackTools;
    otherTools = values.fullstackToolsOther;
  } else if (track === Tracks.MOBILE) {
    tools = values.mobileTools;
    otherTools = values.mobileToolsOther;
  }

  const displayedToolLabels = tools
    .filter(toolValue => toolValue !== 'OTHER')
    .map(toolValue => toolDisplayMap.get(toolValue) || toolValue); 
  const displayTools = [...displayedToolLabels, otherTools]
    .filter(Boolean) 
    .join(', ');

  return (
    <Box>
      <Box as="h3" className="text-xl font-semibold mb-4">
        Please review your application
      </Box>

      {/* Personal Info */}
      <Box as="dl" className="divide-y divide-gray-200 mb-6">
        <SummaryItem
          label="Full Name"
          value={`${values.firstName} ${values.lastName}`}
        />
        <SummaryItem label="Email" value={values.email} capitalize={false} />
        <SummaryItem label="Phone Number" value={values.phoneNumber} />
        <SummaryItem label="City" value={values.city} />
      </Box>

      {/* Track & Tools */}
      <Box as="dl" className="divide-y divide-gray-200 mb-6">
        <SummaryItem
          label="Selected Track"
          value={trackDisplayNames[values.track] || values.track}
        />
        {displayTools && <SummaryItem label="Tools" value={displayTools} />}
      </Box>

      {/* Referral */}
      <Box as="dl" className="divide-y divide-gray-200 mb-6">
        <SummaryItem
          label="Referral Source"
          value={
            referralSourceDisplayNames[values.referralSource] ||
            values.referralSource
          }
        />
        {values.referralSource === 'OTHER' && (
          <SummaryItem label="Other Source" value={values.referralSourceOther} />
        )}
      </Box>

      {/* Confirmation Checkbox */}
      <Box className="mt-6">
        <label className="flex items-center space-x-2">
          <Field type="checkbox" name="confirm" className="rounded" />
          <span>I confirm that all information provided is correct.</span>
        </label>
        <ErrorMessage
          name="confirm"
          component="div"
          className="text-red-600 text-sm mt-1"
        />
      </Box>
    </Box>
  );
};