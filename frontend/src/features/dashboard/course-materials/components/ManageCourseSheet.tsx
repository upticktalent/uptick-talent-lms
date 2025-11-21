'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Box from '@/components/ui/box';
import { Course } from '@/types/dashboard';
import { addCourseMaterial, addCourseAssignment, assignStudentsToCourse } from '@/lib/api/admin';

interface ManageCourseSheetProps {
  course: Course | null;
  onClose: () => void;
}

export const ManageCourseSheet: React.FC<ManageCourseSheetProps> = ({ course, onClose }) => {
  const [activeTab, setActiveTab] = useState('material');

  // --- Form States ---
  const [material, setMaterial] = useState({ title: '', type: 'DOCUMENT', url: '', weekNumber: 1 });
  const [assignment, setAssignment] = useState({ title: '', description: '', dueDate: '' });
  const [studentEmail, setStudentEmail] = useState(''); // Simple assignment by email/ID for now

  // --- Mutations ---
  const { mutate: submitMaterial, isPending: isMatPending } = useMutation({
    mutationFn: addCourseMaterial,
    onSuccess: () => {
      toast.success('Material added successfully');
      setMaterial({ title: '', type: 'DOCUMENT', url: '', weekNumber: 1 });
    },
  });

  const { mutate: submitAssignment, isPending: isAssPending } = useMutation({
    mutationFn: addCourseAssignment,
    onSuccess: () => {
      toast.success('Assignment added successfully');
      setAssignment({ title: '', description: '', dueDate: '' });
    },
  });

  const { mutate: assignStudent, isPending: isStuPending } = useMutation({
    mutationFn: assignStudentsToCourse,
    onSuccess: () => {
      toast.success('Student assigned successfully');
      setStudentEmail('');
    },
  });

  if (!course) return null;

  return (
    <Sheet open={!!course} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Manage: {course.title}</SheetTitle>
          <SheetDescription>Add content or assign students to this course.</SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="material">Materials</TabsTrigger>
            <TabsTrigger value="assignment">Assignments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* --- Add Material Tab --- */}
          <TabsContent value="material" className="space-y-4 mt-4">
            <Box>
              <Label>Title</Label>
              <Input
                value={material.title}
                onChange={e => setMaterial({ ...material, title: e.target.value })}
                placeholder="Lecture Slides Week 1"
              />
            </Box>
            <Box>
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={material.type}
                onChange={e => setMaterial({ ...material, type: e.target.value })}
              >
                <option value="DOCUMENT">Document</option>
                <option value="VIDEO">Video</option>
                <option value="LINK">Link</option>
              </select>
            </Box>
            <Box>
              <Label>URL</Label>
              <Input
                value={material.url}
                onChange={e => setMaterial({ ...material, url: e.target.value })}
                placeholder="https://..."
              />
            </Box>
            <Button
              onClick={() =>
                submitMaterial({
                  ...material,
                  courseId: course.id,
                  type: material.type as 'VIDEO' | 'DOCUMENT' | 'LINK',
                })
              }
              disabled={isMatPending}
              className="w-full"
            >
              Add Material
            </Button>
          </TabsContent>

          {/* --- Add Assignment Tab --- */}
          <TabsContent value="assignment" className="space-y-4 mt-4">
            <Box>
              <Label>Title</Label>
              <Input
                value={assignment.title}
                onChange={e => setAssignment({ ...assignment, title: e.target.value })}
                placeholder="Build a Todo App"
              />
            </Box>
            <Box>
              <Label>Description</Label>
              <Input
                value={assignment.description}
                onChange={e => setAssignment({ ...assignment, description: e.target.value })}
                placeholder="Requirements..."
              />
            </Box>
            <Box>
              <Label>Due Date</Label>
              <Input
                type="datetime-local"
                value={assignment.dueDate}
                onChange={e => setAssignment({ ...assignment, dueDate: e.target.value })}
              />
            </Box>
            <Button
              onClick={() =>
                submitAssignment({
                  ...assignment,
                  courseId: course.id,
                  dueDate: new Date(assignment.dueDate).toISOString(),
                })
              }
              disabled={isAssPending}
              className="w-full"
            >
              Create Assignment
            </Button>
          </TabsContent>

          {/* --- Assign Students Tab --- */}
          <TabsContent value="students" className="space-y-4 mt-4">
            <Box className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mb-4">
              Enter a Student ID to enroll them in this course.
            </Box>
            <Box>
              <Label>Student ID</Label>
              <Input
                value={studentEmail}
                onChange={e => setStudentEmail(e.target.value)}
                placeholder="e.g. uuid-1234..."
              />
            </Box>
            <Button
              onClick={() => assignStudent({ courseId: course.id, studentIds: [studentEmail] })}
              disabled={isStuPending}
              className="w-full"
            >
              Assign Student
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
