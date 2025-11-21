'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Box from '@/components/ui/box';
import { getApplicants, queryKeys, updateApplicantStatus, sendAssessment } from '@/lib';
import { Applicant, ApplicationStatus } from '@/types/dashboard';
import { ApplicantDetailsDialog } from '@/features/dashboard/components/ApplicantDetailsDialog';
import { ApplicantStats, ApplicantsTable } from '@/features/dashboard/components/applicants';
import { SendAssessmentModal } from '@/features/dashboard/components/modals/SendAssessmentModal';
import { getErrorMessage } from '@/utils';

export default function ApplicantsPage() {
  const queryClient = useQueryClient();

  // State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // Modal States
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  // Query
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.APPLICANTS, page, limit, debouncedSearch],
    queryFn: () => getApplicants({ page, limit, search: debouncedSearch }),
    placeholderData: previousData => previousData,
  });

  // Mutation: Update Status
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateApplicantStatus,
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: [queryKeys.APPLICANTS] });
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    },
  });

  // Mutation: Send Assessment
  const { mutateAsync: sendAssessmentMutate } = useMutation({
    mutationFn: sendAssessment,
    onSuccess: () => {
      toast.success('Assessment sent successfully');
      setIsAssessmentModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [queryKeys.APPLICANTS] });
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Failed to send assessment'));
    },
  });

  // Data extraction
  const applicants = data?.payload?.applicants || [];
  const pagination = data?.payload?.pagination;
  const totalPages = pagination?.pages || 1;

  // Handlers
  const handleStatusChange = (applicantId: string, newStatus: ApplicationStatus) => {
    updateStatus({ applicantId, status: newStatus });
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsViewModalOpen(true);
  };

  const handleOpenAssessmentModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsAssessmentModalOpen(true);
  };

  const handleSendAssessment = async (values: {
    assessmentLink: string;
    dueDate: string;
    instructions: string;
  }) => {
    if (!selectedApplicant) return;
    await sendAssessmentMutate({
      applicantIds: [selectedApplicant.id],
      ...values,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getCountByStatus = (status: string) =>
    applicants.filter((a: Applicant) => a.applicationStatus === status).length;

  return (
    <Box className="space-y-6">
      <ApplicantDetailsDialog
        applicant={selectedApplicant}
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      <SendAssessmentModal
        applicant={selectedApplicant}
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        onSubmit={handleSendAssessment}
      />

      <ApplicantStats
        total={pagination?.total || 0}
        accepted={getCountByStatus('ACCEPTED')}
        pending={getCountByStatus('PENDING')}
        assessmentSent={getCountByStatus('ASSESSMENT_SENT')}
        isLoading={isLoading}
      />

      {/* Table Card */}
      <Card>
        <CardHeader>
          <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Box>
              <CardTitle>All Applicants</CardTitle>
              <CardDescription className="mt-1">
                View and manage applicant information
              </CardDescription>
            </Box>
            <Box className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </Box>
          </Box>
        </CardHeader>
        <CardContent>
          {isError ? (
            <Box className="text-center py-10 text-red-500">
              Failed to load applicants. Please try again.
            </Box>
          ) : (
            <ApplicantsTable
              applicants={applicants}
              isLoading={isLoading}
              isUpdating={isUpdating}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onStatusChange={handleStatusChange}
              onViewApplicant={handleViewApplicant}
              onSendAssessment={handleOpenAssessmentModal}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
