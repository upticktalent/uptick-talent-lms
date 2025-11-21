'use client';

import React from 'react';
import { Book, CheckSquare, Calendar, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import Box from '@/components/ui/box';

export const DashboardHome = () => {
  return (
    <Box className="space-y-6">
      {/* Welcome Section */}
      <Box>
        <Box as="h2" className="text-3xl font-bold text-[#000523] flex items-center gap-2">
          Welcome, Faith! <span className="text-3xl">👋</span>
        </Box>
        <Box as="p" className="text-gray-600 mt-2">
          You&apos;re in week 6 of 12 in Frontend Development
        </Box>
        <Box className="mt-2 text-sm flex items-center flex-wrap gap-2">
          <Box as="span" className="font-semibold text-[#000523]">
            Cohort:
          </Box>
          <Box as="span" className="text-gray-700">
            c1
          </Box>
          <Box as="span" className="mx-1">
            •
          </Box>
          <Box as="span" className="font-semibold text-[#000523]">
            Mentor:
          </Box>
          <Box as="span" className="text-gray-700">
            Ms. Emily Joshua
          </Box>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Box className="grid gap-6 md:grid-cols-2">
        <StatsCard
          title="Course Progress"
          value="75%"
          subtext="3 of 4 weeks completed"
          icon={Book}
          iconBg="bg-blue-100"
          iconColor="text-[#477BFF]"
        />
        <StatsCard
          title="Assignments"
          value="2/3"
          subtext="submitted"
          icon={CheckSquare}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Current Grade"
          value="88%"
          subtext="class average: 85%"
          icon={Trophy}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Attendance"
          value="95%"
          subtext="this month"
          icon={Calendar}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
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
          <Box as="p" className="text-4xl font-bold text-[#000523] mb-1">
            {value}
          </Box>
          <Box as="p" className="text-sm text-gray-600">
            {subtext}
          </Box>
        </Box>
        <Box
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            iconBg,
          )}
        >
          <Icon className={cn('h-6 w-6', iconColor)} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);
