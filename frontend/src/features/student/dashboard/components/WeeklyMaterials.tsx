'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Video,
  FileText,
  Link as LinkIcon,
  ClipboardList,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import Box from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { AssessmentSubmission } from './AssessmentSubmission';
import { getCourseMaterials, getAssignments } from '@/lib/api/student';
import { queryKeys } from '@/lib/config/constants';
import { CourseMaterial, Assessment, Week } from '@/types/lms';

interface WeeklyMaterialsProps {
  courseId: string;
}

export const WeeklyMaterials: React.FC<WeeklyMaterialsProps> = ({ courseId }) => {
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // 1. Fetch Materials
  const { data: materialsData, isLoading: isLoadingMaterials } = useQuery({
    queryKey: [queryKeys.STUDENT_MATERIALS, courseId],
    queryFn: () => getCourseMaterials(courseId),
    enabled: !!courseId,
  });

  // 2. Fetch Assignments
  const { data: assignmentsData, isLoading: isLoadingAssignments } = useQuery({
    queryKey: [queryKeys.STUDENT_ASSIGNMENTS, courseId],
    queryFn: () => getAssignments({ courseId }),
    enabled: !!courseId,
  });

  // 3. Organize Data by Week
  const weeks = useMemo(() => {
    const materials = materialsData?.payload || [];
    const assignments = assignmentsData?.payload || [];

    // Find max week number to generate weeks array
    const maxMaterialWeek = Math.max(...materials.map(m => m.weekNumber), 0);
    const maxAssignmentWeek = Math.max(...assignments.map(a => a.weekNumber), 0);
    const totalWeeks = Math.max(maxMaterialWeek, maxAssignmentWeek, 12); // Default to at least 12 weeks

    const organizedWeeks: Week[] = [];

    for (let i = 1; i <= totalWeeks; i++) {
      organizedWeeks.push({
        weekNumber: i,
        title: `Week ${i}`, // You might want a map of week titles if available
        startDate: '', // Backend doesn't provide this in current endpoint list
        endDate: '',
        materials: materials.filter(m => m.weekNumber === i),
        assessments: assignments.filter(a => a.weekNumber === i),
      });
    }
    return organizedWeeks;
  }, [materialsData, assignmentsData]);

  const currentWeekData = weeks.find(w => w.weekNumber === selectedWeekNumber);

  if (isLoadingMaterials || isLoadingAssignments) {
    return <Box className="py-10 text-center">Loading course content...</Box>;
  }

  const getMaterialIcon = (type: CourseMaterial['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'link':
        return <LinkIcon className="w-5 h-5" />;
      default:
        return <ClipboardList className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: Assessment['status']) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    if (status === 'graded')
      return <span className={`${base} bg-green-100 text-green-800`}>Graded</span>;
    if (status === 'submitted')
      return <span className={`${base} bg-blue-100 text-blue-800`}>Submitted</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>Pending</span>;
  };

  return (
    <Box className="space-y-6">
      <Box>
        <h2 className="text-2xl font-bold mb-2">Course Materials</h2>
        <p className="text-muted-foreground">Access your weekly course materials and assessments</p>
      </Box>

      {/* Week Selector */}
      <Box className="flex gap-4 overflow-x-auto pb-4">
        {weeks.map(week => (
          <Button
            key={week.weekNumber}
            variant={selectedWeekNumber === week.weekNumber ? 'default' : 'outline'}
            onClick={() => setSelectedWeekNumber(week.weekNumber)}
            className="whitespace-nowrap"
          >
            Week {week.weekNumber}
          </Button>
        ))}
      </Box>

      {/* Content Area */}
      {currentWeekData && (
        <Box className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Materials Section */}
          <Box>
            <h4 className="text-lg font-medium mb-4">Materials</h4>
            {currentWeekData.materials.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No materials uploaded for this week yet.
              </p>
            ) : (
              <Box className="space-y-3">
                {currentWeekData.materials.map(material => (
                  <Box
                    key={material.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    <Box className="text-primary mt-1">{getMaterialIcon(material.type)}</Box>
                    <Box className="flex-1">
                      <h5 className="font-medium">{material.title}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                      {/* Download/View Links */}
                      {(material.url || material.fileUrl) && (
                        <a
                          href={material.url || material.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-2 inline-block"
                        >
                          {material.type === 'video' ? 'Watch Video' : 'View Resource'} →
                        </a>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Assessments Section */}
          <Box>
            <h4 className="text-lg font-medium mb-4">Assessments</h4>
            {currentWeekData.assessments.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No assessments due for this week.
              </p>
            ) : (
              <Box className="space-y-3">
                {currentWeekData.assessments.map(assessment => (
                  <Box
                    key={assessment.id}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <Box className="flex items-start justify-between">
                      <Box className="flex-1">
                        <h5 className="font-medium">{assessment.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assessment.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                      </Box>
                      {getStatusBadge(assessment.status)}
                    </Box>

                    {assessment.status === 'pending' && (
                      <Button
                        onClick={() => setSelectedAssessment(assessment)}
                        className="mt-2"
                        size="sm"
                      >
                        Submit Assessment
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Submission Modal */}
      {selectedAssessment && (
        <AssessmentSubmission
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onSuccess={() => {
            setSelectedAssessment(null);
            // Invalidate queries to refresh list
          }}
        />
      )}
    </Box>
  );
};
