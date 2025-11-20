'use client';

import React, { useState } from 'react';
import { Video, FileText, Link as LinkIcon, ClipboardList, ChevronRight } from 'lucide-react';
import Box from '@/components/ui/box';
import { Week, CourseMaterial, Assessment } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { AssessmentSubmission } from './AssessmentSubmission';

// Mock data
const mockWeeks: Week[] = [
  {
    weekNumber: 1,
    title: 'Introduction to Frontend Development',
    startDate: '2024-01-15',
    endDate: '2024-01-21',
    materials: [
      {
        id: '1',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the basics of HTML and CSS',
        type: 'video',
        url: 'https://example.com/video1',
        uploadedAt: '2024-01-15',
        weekNumber: 1,
      },
      {
        id: '2',
        title: 'JavaScript Basics',
        description: 'Introduction to JavaScript programming',
        type: 'document',
        fileUrl: 'https://example.com/doc1.pdf',
        uploadedAt: '2024-01-16',
        weekNumber: 1,
      },
    ],
    assessments: [
      {
        id: '1',
        title: 'Week 1 Assessment',
        description: 'Complete the HTML/CSS assignment',
        weekNumber: 1,
        dueDate: '2024-01-21',
        maxScore: 100,
        status: 'pending',
        tasks: [
          'Create a responsive landing page using HTML and CSS',
          'Implement a navigation bar with hover effects',
          'Add a contact form with proper validation',
          'Ensure the page is mobile-friendly',
        ],
      },
    ],
  },
  {
    weekNumber: 2,
    title: 'React Fundamentals',
    startDate: '2024-01-22',
    endDate: '2024-01-28',
    materials: [
      {
        id: '3',
        title: 'React Components',
        description: 'Understanding React components and props',
        type: 'video',
        url: 'https://example.com/video2',
        uploadedAt: '2024-01-22',
        weekNumber: 2,
      },
    ],
    assessments: [
      {
        id: '2',
        title: 'Week 2 Assessment',
        description: 'Build a React component',
        weekNumber: 2,
        dueDate: '2024-01-28',
        maxScore: 100,
        status: 'submitted',
        submittedAt: '2024-01-27',
        score: 85,
        tasks: [
          'Create a reusable Button component with variants',
          'Implement a Card component with props',
          'Build a TodoList component with add/remove functionality',
        ],
      },
    ],
  },
  {
    weekNumber: 3,
    title: 'State Management',
    startDate: '2024-01-29',
    endDate: '2024-02-04',
    materials: [
      {
        id: '4',
        title: 'Redux Basics',
        description: 'Understanding Redux state management',
        type: 'video',
        url: 'https://example.com/video3',
        uploadedAt: '2024-01-29',
        weekNumber: 3,
      },
      {
        id: '5',
        title: 'Context API',
        description: 'Using React Context for state management',
        type: 'document',
        fileUrl: 'https://example.com/doc2.pdf',
        uploadedAt: '2024-01-30',
        weekNumber: 3,
      },
    ],
    assessments: [
      {
        id: '3',
        title: 'Week 3 Assessment',
        description: 'State Management Implementation',
        weekNumber: 3,
        dueDate: '2024-02-04',
        maxScore: 100,
        status: 'submitted',
        submittedAt: '2024-02-03',
        score: 90,
        tasks: [
          'Set up Redux store with actions and reducers',
          'Implement Context API for theme management',
          'Compare and contrast both approaches',
        ],
      },
    ],
  },
  {
    weekNumber: 4,
    title: 'Routing & Navigation',
    startDate: '2024-02-05',
    endDate: '2024-02-11',
    materials: [
      {
        id: '6',
        title: 'React Router',
        description: 'Client-side routing with React Router',
        type: 'video',
        url: 'https://example.com/video4',
        uploadedAt: '2024-02-05',
        weekNumber: 4,
      },
    ],
    assessments: [
      {
        id: '4',
        title: 'Week 4 Assessment',
        description: 'Build a multi-page application',
        weekNumber: 4,
        dueDate: '2024-02-11',
        maxScore: 100,
        status: 'submitted',
        submittedAt: '2024-02-10',
        score: 92,
        tasks: [
          'Set up React Router with multiple routes',
          'Implement protected routes',
          'Add navigation with active state indicators',
        ],
      },
    ],
  },
];

export const WeeklyMaterials: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(mockWeeks[0]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  const getMaterialIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5" />;
      case 'assignment':
        return <ClipboardList className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: Assessment['status']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'pending':
        return (
          <span
            className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}
          >
            Pending
          </span>
        );
      case 'submitted':
        return (
          <span
            className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}
          >
            Submitted
          </span>
        );
      case 'graded':
        return (
          <span
            className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}
          >
            Graded
          </span>
        );
    }
  };

  return (
    <Box className="space-y-6">
      <Box>
        <h2 className="text-2xl font-bold mb-2">Course Materials</h2>
        <p className="text-muted-foreground">Access your weekly course materials and assessments</p>
      </Box>

      <Box className="flex gap-4 overflow-x-auto pb-4">
        {mockWeeks.map(week => (
          <Button
            key={week.weekNumber}
            variant={selectedWeek?.weekNumber === week.weekNumber ? 'default' : 'outline'}
            onClick={() => setSelectedWeek(week)}
            className="whitespace-nowrap"
          >
            Week {week.weekNumber}
          </Button>
        ))}
      </Box>

      {selectedWeek && (
        <Box className="bg-card border border-border rounded-lg p-6 space-y-6">
          <Box>
            <h3 className="text-xl font-semibold mb-2">{selectedWeek.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedWeek.startDate).toLocaleDateString()} -{' '}
              {new Date(selectedWeek.endDate).toLocaleDateString()}
            </p>
          </Box>

          <Box>
            <h4 className="text-lg font-medium mb-4">Materials</h4>
            <Box className="space-y-3">
              {selectedWeek.materials.map(material => (
                <Box
                  key={material.id}
                  className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Box className="text-primary mt-1">{getMaterialIcon(material.type)}</Box>
                  <Box className="flex-1">
                    <h5 className="font-medium">{material.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                    {material.url && (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        Open Link →
                      </a>
                    )}
                    {material.fileUrl && (
                      <a
                        href={material.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        Download File →
                      </a>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <h4 className="text-lg font-medium mb-4">Assessments</h4>
            <Box className="space-y-3">
              {selectedWeek.assessments.map(assessment => (
                <Box key={assessment.id} className="p-4 border border-border rounded-lg space-y-3">
                  <Box className="flex items-start justify-between">
                    <Box className="flex-1">
                      <h5 className="font-medium">{assessment.title}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{assessment.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Due: {new Date(assessment.dueDate).toLocaleDateString()}
                      </p>
                    </Box>
                    {getStatusBadge(assessment.status)}
                  </Box>

                  {(assessment.tasks || assessment.questions) && (
                    <Box className="pt-3 border-t border-border">
                      <h6 className="font-medium text-sm mb-2">Tasks / Questions:</h6>
                      <Box className="space-y-2">
                        {assessment.tasks?.map((task, index) => (
                          <Box key={index} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{task}</span>
                          </Box>
                        ))}
                        {assessment.questions?.map((question, index) => (
                          <Box key={index} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{question}</span>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {assessment.status === 'graded' && assessment.score !== undefined && (
                    <Box className="pt-2 border-t border-border">
                      <p className="text-sm">
                        Score:{' '}
                        <span className="font-semibold">
                          {assessment.score}/{assessment.maxScore}
                        </span>
                      </p>
                      {assessment.feedback && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Feedback: {assessment.feedback}
                        </p>
                      )}
                    </Box>
                  )}
                  {assessment.status === 'pending' && (
                    <Button onClick={() => setSelectedAssessment(assessment)} className="mt-2">
                      Submit Assessment
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {selectedAssessment && (
        <AssessmentSubmission
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onSuccess={() => {
            setSelectedAssessment(null);
            // Refresh data or update state
          }}
        />
      )}
    </Box>
  );
};
