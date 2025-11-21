'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, BookOpen, Layers, Users, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Box from '@/components/ui/box';
import { CreateCourseModal } from '@/features/dashboard/course-materials/components/CreateCourseModal';
import { ManageCourseSheet } from '@/features/dashboard/course-materials/components/ManageCourseSheet';
import { getAdminCourses, createCourse } from '@/lib/api/admin';
import { queryKeys } from '@/lib/config/constants';
import { Course } from '@/types/dashboard';
import { getErrorMessage } from '@/utils/errors';

export default function CourseMaterialsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // 1. Fetch Courses
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.ADMIN_COURSES],
    queryFn: getAdminCourses,
  });

  // FIX: Access the nested .courses array
  const courses = data?.payload?.courses || [];

  // 2. Create Mutation
  const { mutateAsync: createCourseMutate } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast.success('Course created successfully');
      queryClient.invalidateQueries({ queryKey: [queryKeys.ADMIN_COURSES] });
      setIsCreateOpen(false);
    },
    onError: error => toast.error(getErrorMessage(error, 'Failed to create course')),
  });

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Box>
          <h1 className="text-2xl font-bold text-[#000523]">Course Materials</h1>
          <p className="text-muted-foreground">
            Manage courses, upload materials, and assign tasks.
          </p>
        </Box>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-[#477BFF]">
          <Plus className="w-4 h-4 mr-2" /> Create Course
        </Button>
      </Box>

      {/* Course Grid */}
      {isLoading ? (
        <Box className="text-center py-10">Loading courses...</Box>
      ) : courses.length === 0 ? (
        <Box className="text-center py-20 border-2 border-dashed rounded-lg">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium">No courses yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first course.</p>
          <Button onClick={() => setIsCreateOpen(true)} variant="outline">
            Create Course
          </Button>
        </Box>
      ) : (
        <Box className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Box className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium mb-2 inline-block">
                    {course.track}
                  </Box>
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Box className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-100 my-4">
                  <Box className="text-center">
                    <BookOpen className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-600">Materials</span>
                  </Box>
                  <Box className="text-center border-l border-gray-100">
                    <Layers className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-600">Assignments</span>
                  </Box>
                  <Box className="text-center border-l border-gray-100">
                    <Users className="w-4 h-4 mx-auto text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-600">Students</span>
                  </Box>
                </Box>
                <Button
                  variant="outline"
                  className="w-full border-[#477BFF] text-[#477BFF] hover:bg-[#477BFF]/5"
                  onClick={() => setSelectedCourse(course)}
                >
                  Manage Content
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Modals */}
      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createCourseMutate}
      />

      <ManageCourseSheet course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </Box>
  );
}
