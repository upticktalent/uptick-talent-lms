'use client';

import React, { useState } from 'react';
import { Search, UserCircle2, Mail, Phone, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { getApplicants, queryKeys } from '@/lib';
import { Applicant } from '@/types/dashboard';

const getStatusColor = (status: string) => {
  // Normalize status to handle case sensitivity
  const normalizedStatus = status?.toLowerCase() || '';

  switch (normalizedStatus) {
    case 'accepted':
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'assessment_sent':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ApplicantsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.APPLICANTS],
    queryFn: getApplicants,
  });

  const applicants = data?.payload?.applicants || [];
  const stats = data?.payload?.stats || [];

  const filteredApplicants = applicants.filter((applicant: Applicant) => {
    const fullName = `${applicant.firstName} ${applicant.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalApplicants = data?.payload?.pagination?.total || applicants.length;

  // Helper to get count safely
  const getCountByStatus = (status: string) =>
    applicants.filter((a: Applicant) => a.applicationStatus === status).length;

  return (
    <Box className="space-y-6">
      {/* Stats */}
      <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Applicants</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLoading ? '-' : totalApplicants}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Accepted</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLoading ? '-' : getCountByStatus('ACCEPTED')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-2xl font-bold text-[#477BFF]">
              {isLoading ? '-' : getCountByStatus('PENDING')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Assessment Sent</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {isLoading ? '-' : getCountByStatus('ASSESSMENT_SENT')}
            </CardTitle>
          </CardHeader>
        </Card>
      </Box>

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
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </Box>
          </Box>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Box className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#477BFF]" />
            </Box>
          ) : isError ? (
            <Box className="text-center py-10 text-red-500">
              Failed to load applicants. Please try again.
            </Box>
          ) : filteredApplicants.length === 0 ? (
            <Box className="text-center py-10 text-muted-foreground">No applicants found.</Box>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplicants.map((applicant: Applicant) => (
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
                    <TableCell>
                      {applicant.track ? applicant.track.replace(/_/g, ' ') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {applicant.createdAt
                        ? new Date(applicant.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(applicant.applicationStatus),
                        )}
                      >
                        {applicant.applicationStatus.replace(/_/g, ' ')}
                      </Box>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[#477BFF]">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
