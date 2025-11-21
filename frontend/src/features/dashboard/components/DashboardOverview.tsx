'use client';

import React from 'react';
import Box from '@/components/ui/box';
import { Student, Mentor } from '@/types/lms';
import { StudentStats } from '@/types/student';
// import { ProgressTracking } from './ProgressTracking'; // Commented out until we have week-by-week data

interface DashboardOverviewProps {
  student: Student;
  mentor?: Mentor; // Made optional
  stats: StudentStats; // Changed from 'progress' to 'stats'
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ student, mentor, stats }) => {
  return (
    <Box className="space-y-6">
      <Box>
        <h1 className="text-3xl font-bold">Welcome back, {student.firstName}! 👋</h1>
        <p className="text-muted-foreground mt-2">Here's your learning overview</p>
      </Box>

      {/* Stats Grid */}
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Box className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Track</h3>
          <p className="text-2xl font-bold">{student.track || 'N/A'}</p>
        </Box>

        <Box className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Courses</h3>
          <p className="text-2xl font-bold">{stats.totalCourses}</p>
        </Box>

        <Box className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Pending Assignments</h3>
          <p className="text-2xl font-bold text-orange-500">{stats.pendingAssignments}</p>
        </Box>

        <Box className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Submitted</h3>
          <p className="text-2xl font-bold text-green-500">{stats.submittedAssignments}</p>
        </Box>
      </Box>

      {/* Mentor Card - Only render if mentor exists */}
      {mentor ? (
        <Box className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mentor Information</h2>
          <Box className="flex items-start gap-4">
            <Box className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {mentor.firstName?.[0]}
                {mentor.lastName?.[0]}
              </span>
            </Box>
            <Box className="flex-1">
              <h3 className="text-lg font-semibold">
                {mentor.firstName} {mentor.lastName}
              </h3>
              <p className="text-muted-foreground">{mentor.bio || 'Mentor'}</p>
              <p className="text-sm text-muted-foreground mt-2">{mentor.email}</p>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Mentor Information</h2>
          <p className="text-muted-foreground">No mentor assigned yet.</p>
        </Box>
      )}

      {/* <ProgressTracking /> */}
    </Box>
  );
};
