'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Box from '@/components/ui/box';
import { getAdminCohorts } from '@/lib/api/admin';
import { queryKeys } from '@/lib/config/constants';
import { Cohort } from '@/types/dashboard';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    track: string;
    cohortId: string;
  }) => Promise<void>;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // 1. Fetch Cohorts
  const { data: cohortsResponse, isLoading: isLoadingCohorts } = useQuery({
    queryKey: [queryKeys.ADMIN_COHORTS],
    queryFn: getAdminCohorts,
    enabled: isOpen,
  });

  // FIX: Access the nested 'cohorts' array inside payload
  const cohorts = cohortsResponse?.payload?.cohorts || [];

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      track: '',
      cohortId: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      track: Yup.string().required('Track is required'),
      cohortId: Yup.string().required('Cohort is required'),
    }),
    onSubmit: async values => {
      await onSubmit(values);
      formik.resetForm();
      onClose();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-[#000523]">Create New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Title */}
          <Box>
            <Label className="mb-3 block text-sm font-semibold text-gray-700">Course Title</Label>
            <Input
              {...formik.getFieldProps('title')}
              placeholder="e.g. Frontend Fundamentals"
              className="h-12"
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.title}</p>
            )}
          </Box>

          {/* Description */}
          <Box>
            <Label className="mb-3 block text-sm font-semibold text-gray-700">Description</Label>
            <Textarea
              {...formik.getFieldProps('description')}
              placeholder="Brief overview..."
              className="min-h-[120px] resize-none p-3"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.description}</p>
            )}
          </Box>

          <div className="grid grid-cols-2 gap-6">
            {/* Track Selection */}
            <Box>
              <Label className="mb-3 block text-sm font-semibold text-gray-700">Track</Label>
              <Select
                onValueChange={val => formik.setFieldValue('track', val)}
                value={formik.values.track}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRONTEND">Frontend</SelectItem>
                  <SelectItem value="BACKEND">Backend</SelectItem>
                  <SelectItem value="MOBILE_DEVELOPMENT">Mobile Development</SelectItem>
                  <SelectItem value="PRODUCT_DESIGN">Product Design</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.track && formik.errors.track && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.track}</p>
              )}
            </Box>

            {/* Cohort Selection */}
            <Box>
              <Label className="mb-3 block text-sm font-semibold text-gray-700">Cohort</Label>
              <Select
                onValueChange={val => formik.setFieldValue('cohortId', val)}
                value={formik.values.cohortId}
                disabled={isLoadingCohorts}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={isLoadingCohorts ? 'Loading...' : 'Select Cohort'} />
                </SelectTrigger>
                <SelectContent>
                  {cohorts.length > 0 ? (
                    cohorts.map((cohort: Cohort) => (
                      <SelectItem key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No cohorts found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {formik.touched.cohortId && formik.errors.cohortId && (
                <p className="text-xs text-red-500 mt-1">{formik.errors.cohortId}</p>
              )}
            </Box>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="h-11 px-8">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isLoadingCohorts}
              className="bg-[#477BFF] h-11 px-8"
            >
              {formik.isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create Course'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
