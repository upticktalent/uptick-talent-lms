'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react'; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Box from '@/components/ui/box';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <Box className="flex flex-col items-center gap-4 mb-2">
            <Box className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
            </Box>
            <DialogTitle className="text-2xl text-center">
              Application Received!
            </DialogTitle>
          </Box>
          <DialogDescription className="text-center text-base pt-2">
            Thank you for applying to the Uptick Talent Fellowship.
            <br />
            <br />
            We have sent a confirmation email to{' '}
            <span className="font-semibold text-foreground">{email}</span> with
            more details about the next steps in the selection process.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-4">
          <Button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto min-w-[140px]"
          >
            Return to Home
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};