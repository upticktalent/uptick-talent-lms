'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = ({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) => {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
};

const CollapsibleTrigger = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) => {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
};

const CollapsibleContent = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) => {
  return <CollapsiblePrimitive.Content data-slot="collapsible-content" {...props} />;
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
