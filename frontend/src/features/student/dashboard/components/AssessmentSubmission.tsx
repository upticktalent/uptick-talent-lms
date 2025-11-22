'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Box from '@/components/ui/box';
import { Assessment } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { submitAssignment } from '@/lib/api/student';
import { queryKeys } from '@/lib/config/constants';
import { getErrorMessage } from '@/utils/errors';

interface AssessmentSubmissionProps {
  assessment: Assessment;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssessmentSubmission: React.FC<AssessmentSubmissionProps> = ({
  assessment,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [content, setContent] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: submitAssignment,
    onSuccess: () => {
      toast.success('Assignment submitted successfully!');
      queryClient.invalidateQueries({ queryKey: [queryKeys.STUDENT_ASSIGNMENTS] });
      onSuccess();
      onClose();
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Failed to submit assignment'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      assignmentId: assessment.id,
      fileUrl: submissionUrl,
      content: content,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit Assessment</DialogTitle>
          <DialogDescription>{assessment.title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Box>
            <label className="block text-sm font-medium mb-2">
              Submission Link (GitHub, Google Drive, etc.)
            </label>
            <Input
              type="url"
              value={submissionUrl}
              onChange={e => setSubmissionUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </Box>

          <Box>
            <label className="block text-sm font-medium mb-2">Additional Comments (Optional)</label>
            <Input
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Any notes for your mentor..."
            />
          </Box>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
