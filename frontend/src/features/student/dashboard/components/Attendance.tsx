'use client';

import React from 'react';
import Box from '@/components/ui/box';
import { LiveClass } from '@/types/lms';

const mockAttendanceHistory: LiveClass[] = [
  {
    id: '2',
    title: 'State Management Workshop',
    description: 'Understanding Redux and Context API',
    scheduledAt: '2024-01-20T14:00:00',
    duration: 60,
    googleMeetLink: '#',
    status: 'completed',
    attendance: {
      id: '1',
      classId: '2',
      studentId: '1',
      status: 'present',
      joinedAt: '2024-01-20T14:02:00',
      leftAt: '2024-01-20T15:00:00',
      duration: 58,
    },
  },
  {
    id: '3',
    title: 'Code Review Session',
    description: 'Reviewing student projects',
    scheduledAt: '2024-01-18T16:00:00',
    duration: 45,
    googleMeetLink: '#',
    status: 'completed',
    attendance: {
      id: '2',
      classId: '3',
      studentId: '1',
      status: 'late',
      joinedAt: '2024-01-18T16:05:00',
      leftAt: '2024-01-18T16:45:00',
      duration: 40,
    },
  },
];

export const Attendance: React.FC = () => {
  // Calculate stats
  const totalClasses = 14; // Mock total
  const attended = 12;
  const late = 2;
  const percentage = Math.round((attended / totalClasses) * 100);

  const getStatusBadge = (status: string) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium capitalize';
    if (status === 'present')
      return <span className={`${base} bg-green-100 text-green-800`}>Present</span>;
    if (status === 'late')
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>Late</span>;
    return <span className={`${base} bg-red-100 text-red-800`}>Absent</span>;
  };

  return (
    <Box className="space-y-6">
      <Box>
        <h1 className="text-3xl font-bold mb-2">Attendance</h1>
        <p className="text-muted-foreground">Track your class participation and history</p>
      </Box>

      {/* Summary Cards */}
      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box className="text-center p-6 bg-card border border-border rounded-lg shadow-sm">
          <p className="text-4xl font-bold text-primary mb-2">{percentage}%</p>
          <p className="text-sm text-muted-foreground font-medium">Overall Attendance</p>
        </Box>
        <Box className="text-center p-6 bg-card border border-border rounded-lg shadow-sm">
          <p className="text-4xl font-bold text-green-600 mb-2">{attended}</p>
          <p className="text-sm text-muted-foreground font-medium">Classes Attended</p>
        </Box>
        <Box className="text-center p-6 bg-card border border-border rounded-lg shadow-sm">
          <p className="text-4xl font-bold text-yellow-600 mb-2">{late}</p>
          <p className="text-sm text-muted-foreground font-medium">Late Arrivals</p>
        </Box>
      </Box>

      {/* History List */}
      <Box className="bg-card border border-border rounded-lg overflow-hidden">
        <Box className="p-4 border-b border-border">
          <h3 className="font-semibold">Attendance History</h3>
        </Box>
        <Box className="divide-y divide-border">
          {mockAttendanceHistory.map(record => (
            <Box
              key={record.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <Box>
                <p className="font-medium">{record.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(record.scheduledAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </Box>

              <Box className="flex items-center gap-4">
                <Box className="text-right hidden md:block">
                  <p className="text-sm font-medium">{record.attendance?.duration} mins</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </Box>
                {getStatusBadge(record.attendance?.status || 'absent')}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
