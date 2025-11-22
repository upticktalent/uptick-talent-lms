'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardOverview } from '@/features/student/dashboard/components/DashboardOverview';
import { WeeklyMaterials } from '@/features/student/dashboard/components/WeeklyMaterials';
import { getStudentDashboard } from '@/lib/api/student';
import { queryKeys } from '@/lib/config/constants';
import Box from '@/components/ui/box';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKeys.STUDENT_DASHBOARD],
    queryFn: getStudentDashboard,
  });

  if (isLoading) {
    return (
      <Box className="h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Box>
    );
  }

  if (isError || !data?.payload) {
    return <Box className="p-6 text-center text-red-500">Failed to load dashboard data.</Box>;
  }

  // Destructure based on the NEW response structure
  const { student, mentor, stats, courses } = data.payload;

  // Determine active course: Use the first course in the list if available, or null
  const activeCourseId = courses && courses.length > 0 ? courses[0].id : null;

  return (
    <div className="space-y-8">
      <DashboardOverview student={student} mentor={mentor} stats={stats} />

      {activeCourseId ? (
        <WeeklyMaterials courseId={activeCourseId} />
      ) : (
        <Box className="text-center py-10 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
        </Box>
      )}
    </div>
  );
}
