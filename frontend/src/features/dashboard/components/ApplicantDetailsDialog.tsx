'use client';

import React from 'react';
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
import { Applicant } from '@/types/dashboard';
import { formatDate } from '@/components/common/DatePicker';

interface ApplicantDetailsDialogProps {
  applicant: Applicant | null;
  open: boolean;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0">
    <Box as="span" className="text-sm font-medium text-gray-500">
      {label}
    </Box>
    <Box as="span" className="col-span-2 text-sm text-[#000523] font-medium">
      {value || '-'}
    </Box>
  </Box>
);

export const ApplicantDetailsDialog: React.FC<ApplicantDetailsDialogProps> = ({
  applicant,
  open,
  onClose,
}) => {
  if (!applicant) return null;

  // Combine tools for display
  const tools = [
    ...(applicant.frontendTools || []),
    ...(applicant.backendTools || []),
    ...(applicant.mobileTools || []),
  ].join(', ');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#000523]">Applicant Details</DialogTitle>
          <DialogDescription>
            Submitted on {new Date(applicant.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Box className="mt-4 space-y-6">
          {/* Section: Personal Info */}
          <Box>
            <Box as="h4" className="text-sm uppercase tracking-wider text-[#477BFF] font-bold mb-3">
              Personal Information
            </Box>
            <Box className="bg-gray-50 p-4 rounded-lg">
              <DetailRow label="Full Name" value={`${applicant.firstName} ${applicant.lastName}`} />
              <DetailRow label="Email" value={applicant.email} />
              <DetailRow label="Phone" value={applicant.phoneNumber} />
              <DetailRow
                label="Location"
                value={`${applicant.city}, ${applicant.state}, ${applicant.country}`}
              />
            </Box>
          </Box>

          {/* Section: Application Data */}
          <Box>
            <Box as="h4" className="text-sm uppercase tracking-wider text-[#477BFF] font-bold mb-3">
              Track & Skills
            </Box>
            <Box className="bg-gray-50 p-4 rounded-lg">
              <DetailRow label="Selected Track" value={applicant.track.replace(/_/g, ' ')} />
              <DetailRow label="Tools/Skills" value={tools} />
              <DetailRow label="Referral Source" value={applicant.referralSource} />
            </Box>
          </Box>

          {/* Section: Status */}
          <Box>
            <Box as="h4" className="text-sm uppercase tracking-wider text-[#477BFF] font-bold mb-3">
              Current Status
            </Box>
            <Box className="bg-gray-50 p-4 rounded-lg">
              <DetailRow label="Status" value={applicant.applicationStatus.replace(/_/g, ' ')} />
            </Box>
          </Box>
        </Box>

        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
