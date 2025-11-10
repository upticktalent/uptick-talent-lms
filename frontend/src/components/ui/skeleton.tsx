import { cn } from '@/lib/utils';
import Box from './box';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Box
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
