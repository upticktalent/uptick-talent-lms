'use client';

import React from 'react';
import { UserCircle2, Mail, Phone, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { Applicant, ApplicationStatus } from '@/types/dashboard';
import { ApplicantRowActions } from './ApplicantRowActions';

const STATUS_OPTIONS = Object.values(ApplicationStatus);

const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase() || '';
  if (normalizedStatus.includes('accepted')) return 'bg-green-100 text-green-800 border-green-200';
  if (normalizedStatus.includes('pending'))
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (normalizedStatus.includes('rejected')) return 'bg-red-100 text-red-800 border-red-200';
  if (normalizedStatus.includes('assessment'))
    return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-blue-100 text-blue-800 border-blue-200';
};

interface ApplicantsTableProps {
  applicants: Applicant[];
  isLoading: boolean;
  isUpdating: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onViewApplicant: (applicant: Applicant) => void;
  onSendAssessment: (applicant: Applicant) => void;
}

export const ApplicantsTable: React.FC<ApplicantsTableProps> = ({
  applicants,
  isLoading,
  isUpdating,
  page,
  totalPages,
  onPageChange,
  onStatusChange,
  onViewApplicant,
  onSendAssessment,
}) => {
  if (isLoading) {
    return (
      <Box className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#477BFF]" />
      </Box>
    );
  }

  if (applicants.length === 0) {
    return <Box className="text-center py-10 text-muted-foreground">No applicants found.</Box>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead className="w-[200px]">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map(applicant => (
            <TableRow key={applicant.id}>
              <TableCell>
                <Box className="flex items-center gap-3">
                  <Box className="w-10 h-10 rounded-full bg-[#477BFF]/10 flex items-center justify-center">
                    <UserCircle2 className="h-6 w-6 text-[#477BFF]" />
                  </Box>
                  <Box>
                    <Box as="p" className="font-medium text-[#000523]">
                      {applicant.firstName} {applicant.lastName}
                    </Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <Box className="flex items-center gap-2">
                    <Mail className="h-3 w-3" /> {applicant.email}
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Phone className="h-3 w-3" /> {applicant.phoneNumber}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{applicant.track ? applicant.track.replace(/_/g, ' ') : 'N/A'}</TableCell>
              <TableCell>
                {applicant.createdAt ? new Date(applicant.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={applicant.applicationStatus}
                  onValueChange={value => onStatusChange(applicant.id, value as ApplicationStatus)}
                  disabled={isUpdating}
                >
                  <SelectTrigger
                    className={cn(
                      'h-8 w-full border-none font-medium focus:ring-0',
                      getStatusColor(applicant.applicationStatus),
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <ApplicantRowActions
                  applicant={applicant}
                  onView={onViewApplicant}
                  onSendAssessment={onSendAssessment}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <Box className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Box className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </Box>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Box>
    </>
  );
};
