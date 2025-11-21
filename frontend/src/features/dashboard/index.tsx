'use client';

import React, { useEffect, useState } from 'react';
import { Users, UserCheck, UserPlus, Clock, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';
import { getApplicants } from '@/lib/api/admin';
import { queryKeys } from '@/lib/config/constants';
import { getLocalItem } from '@/lib/config/storage';
import { DashboardStats } from '@/types/dashboard';

export const DashboardHome = () => {
  // State for user name to avoid hydration mismatch
  const [user, setUser] = useState<{ firstName: string } | null>(null);

  useEffect(() => {
    const userData = getLocalItem<{ firstName: string }>({ key: 'user' });
    setUser(userData);
  }, []);

  // Fetch Stats (limit 1 just to get the stats object from the payload)
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.APPLICANTS],
    queryFn: () => getApplicants({ limit: 1 }),
  });

  const stats = data?.payload?.stats || [];
  const totalApplicants = data?.payload?.pagination?.total || 0;

  // Helper to extract counts safely from the stats array
  const getCount = (status: string) => {
    // Normalize status check
    const stat = stats.find((s: DashboardStats) => s.applicationStatus === status);
    return stat?._count?.id || 0;
  };

  const pendingCount = getCount('PENDING');
  const acceptedCount = getCount('ACCEPTED');
  // Combine assessment statuses if you have multiple
  const assessmentCount = getCount('ASSESSMENT_SENT') + getCount('ASSESSMENT_SUBMITTED');

  return (
    <Box className="space-y-8">
      {/* Header Section */}
      <Box className="flex flex-col gap-2">
        <Box as="h2" className="text-3xl font-bold text-[#000523]">
          Welcome back, {user?.firstName || 'Admin'} 👋
        </Box>
        <Box as="p" className="text-gray-500">
          Here is an overview of the application portal status.
        </Box>
      </Box>

      {/* Admin Stats Grid */}
      <Box className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Applicants"
          value={isLoading ? '-' : totalApplicants.toString()}
          subtext="All time applications"
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Pending Review"
          value={isLoading ? '-' : pendingCount.toString()}
          subtext="Requires attention"
          icon={Clock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatsCard
          title="Accepted Students"
          value={isLoading ? '-' : acceptedCount.toString()}
          subtext="Joined the cohort"
          icon={UserCheck}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="In Assessment"
          value={isLoading ? '-' : assessmentCount.toString()}
          subtext="Active tests"
          icon={UserPlus}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </Box>

      {/* Quick Actions Section */}
      <Box className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Box className="grid gap-4">
              <Box
                as="a"
                href="/dashboard/applicants"
                className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Box>
                  <Box as="p" className="font-medium text-[#000523]">
                    Review Pending Applicants
                  </Box>
                  <Box as="p" className="text-sm text-gray-500">
                    You have {pendingCount} applicants waiting for review
                  </Box>
                </Box>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </Box>

              <Box
                as="a"
                href="/dashboard/course-materials"
                className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <Box>
                  <Box as="p" className="font-medium text-[#000523]">
                    Manage Course Materials
                  </Box>
                  <Box as="p" className="text-sm text-gray-500">
                    Upload or edit resources for the current cohort
                  </Box>
                </Box>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* System Health / Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Box className="flex items-center gap-2 mb-4">
              <Box className="w-3 h-3 rounded-full bg-green-500" />
              <Box as="span" className="text-sm font-medium">
                All systems operational
              </Box>
            </Box>
            <Box className="space-y-4">
              <Box className="flex justify-between text-sm border-b pb-2">
                <span className="text-gray-500">Server Uptime</span>
                <span className="font-medium">99.9%</span>
              </Box>
              <Box className="flex justify-between text-sm border-b pb-2">
                <span className="text-gray-500">Database Status</span>
                <span className="font-medium text-green-600">Connected</span>
              </Box>
              <Box className="flex justify-between text-sm">
                <span className="text-gray-500">Last Backup</span>
                <span className="font-medium">2 hours ago</span>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

// Helper Component for Stats
interface StatsCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <Box className="flex items-start justify-between">
        <Box>
          <Box as="p" className="text-sm text-gray-500 mb-1">
            {title}
          </Box>
          <Box as="p" className="text-3xl font-bold text-[#000523] mb-1">
            {value}
          </Box>
          <Box as="p" className="text-xs text-gray-600">
            {subtext}
          </Box>
        </Box>
        <Box
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
            iconBg,
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor)} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);
