'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Applicant } from '@/types/dashboard';

interface SendAssessmentModalProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    assessmentLink: string;
    dueDate: string;
    instructions: string;
  }) => Promise<void>;
}

const validationSchema = Yup.object({
  assessmentLink: Yup.string().url('Must be a valid URL').required('Link is required'),
  dueDate: Yup.date()
    .required('Due date is required')
    .min(new Date(), 'Date must be in the future'),
  instructions: Yup.string().required('Instructions are required'),
});

export const SendAssessmentModal: React.FC<SendAssessmentModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      assessmentLink: '',
      dueDate: '',
      instructions: '',
    },
    validationSchema,
    onSubmit: async values => {
      await onSubmit({
        ...values,
        // Ensure date is ISO string
        dueDate: new Date(values.dueDate).toISOString(),
      });
      formik.resetForm();
      onClose();
    },
  });

  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Assessment</DialogTitle>
          <DialogDescription>
            Send a technical assessment to{' '}
            <span className="font-medium text-foreground">
              {applicant.firstName} {applicant.lastName}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          {/* Submission URL */}
          <div className="space-y-2">
            <Label htmlFor="assessmentLink">Submission URL</Label>
            <Input
              id="assessmentLink"
              placeholder="https://..."
              {...formik.getFieldProps('assessmentLink')}
              className={
                formik.touched.assessmentLink && formik.errors.assessmentLink
                  ? 'border-red-500'
                  : ''
              }
            />
            {formik.touched.assessmentLink && formik.errors.assessmentLink && (
              <p className="text-xs text-red-500">{formik.errors.assessmentLink}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...formik.getFieldProps('dueDate')}
              className={formik.touched.dueDate && formik.errors.dueDate ? 'border-red-500' : ''}
            />
            {formik.touched.dueDate && formik.errors.dueDate && (
              <p className="text-xs text-red-500">{formik.errors.dueDate as string}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter detailed instructions..."
              {...formik.getFieldProps('instructions')}
            />
            {formik.touched.instructions && formik.errors.instructions && (
              <p className="text-xs text-red-500">{formik.errors.instructions}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Assessment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
