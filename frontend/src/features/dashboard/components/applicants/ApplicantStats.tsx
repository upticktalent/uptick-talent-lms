'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Box from '@/components/ui/box';

interface ApplicantStatsProps {
  total: number;
  accepted: number;
  pending: number;
  assessmentSent: number;
  isLoading: boolean;
}

export const ApplicantStats: React.FC<ApplicantStatsProps> = ({
  total,
  accepted,
  pending,
  assessmentSent,
  isLoading,
}) => {
  return (
    <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Total Applicants</CardDescription>
          <CardTitle className="text-2xl font-bold text-primary">
            {isLoading ? '-' : total}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Accepted</CardDescription>
          <CardTitle className="text-2xl font-bold text-primary">
            {isLoading ? '-' : accepted}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Pending Review</CardDescription>
          <CardTitle className="text-2xl font-bold text-[#477BFF]">
            {isLoading ? '-' : pending}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Assessment Sent</CardDescription>
          <CardTitle className="text-2xl font-bold text-primary">
            {isLoading ? '-' : assessmentSent}
          </CardTitle>
        </CardHeader>
      </Card>
    </Box>
  );
};
