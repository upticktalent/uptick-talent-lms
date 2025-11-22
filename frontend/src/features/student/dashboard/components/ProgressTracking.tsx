'use client';

import React from 'react';
import Box from '@/components/ui/box';

interface ProgressData {
  week: number;
  title: string;
  completed: boolean;
  score?: number;
  maxScore: number;
}

const mockProgress: ProgressData[] = [
  {
    week: 1,
    title: 'Introduction to Frontend Development',
    completed: true,
    score: 85,
    maxScore: 100,
  },
  { week: 2, title: 'React Fundamentals', completed: true, score: 90, maxScore: 100 },
  { week: 3, title: 'State Management', completed: true, score: 88, maxScore: 100 },
  { week: 4, title: 'Routing & Navigation', completed: true, score: 92, maxScore: 100 },
  { week: 5, title: 'API Integration', completed: false, score: undefined, maxScore: 100 },
  { week: 6, title: 'Testing & Debugging', completed: false, score: undefined, maxScore: 100 },
  { week: 7, title: 'Performance Optimization', completed: false, score: undefined, maxScore: 100 },
  { week: 8, title: 'Deployment', completed: false, score: undefined, maxScore: 100 },
];

export const ProgressTracking: React.FC = () => {
  const completedWeeks = mockProgress.filter(p => p.completed).length;
  const totalWeeks = mockProgress.length;
  const averageScore =
    mockProgress
      .filter(p => p.completed && p.score !== undefined)
      .reduce((acc, p) => acc + (p.score || 0), 0) / completedWeeks;

  return (
    <Box className="bg-card border border-border rounded-lg p-6 space-y-6">
      <Box>
        <h3 className="text-xl font-semibold mb-2">Learning Progress</h3>
        <Box className="flex items-center gap-4 mb-4">
          <Box className="flex-1">
            <Box className="h-3 bg-accent rounded-full overflow-hidden">
              <Box
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(completedWeeks / totalWeeks) * 100}%` }}
              />
            </Box>
          </Box>
          <span className="text-sm font-medium">
            {completedWeeks}/{totalWeeks} weeks
          </span>
        </Box>
        <p className="text-sm text-muted-foreground">
          Average Score: <span className="font-semibold">{Math.round(averageScore)}%</span>
        </p>
      </Box>

      <Box className="space-y-3">
        {mockProgress.map(progress => (
          <Box
            key={progress.week}
            className="flex items-center justify-between p-3 border border-border rounded-lg"
          >
            <Box className="flex items-center gap-3">
              <Box
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  progress.completed
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                }`}
              >
                {progress.completed ? '✓' : progress.week}
              </Box>
              <Box>
                <p className="font-medium">Week {progress.week}</p>
                <p className="text-sm text-muted-foreground">{progress.title}</p>
              </Box>
            </Box>
            {progress.completed && progress.score !== undefined && (
              <span className="text-sm font-semibold">
                {progress.score}/{progress.maxScore}
              </span>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
