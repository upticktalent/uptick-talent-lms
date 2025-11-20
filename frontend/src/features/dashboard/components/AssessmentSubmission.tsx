'use client';

import React, { useState } from 'react';
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
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      // await client.post(`/assessments/${assessment.id}/submit`, {
      //   submissionUrl,
      //   file,
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSuccess();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              Submission URL (GitHub, CodeSandbox, etc.)
            </label>
            <Input
              type="url"
              value={submissionUrl}
              onChange={e => setSubmissionUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              required
            />
          </Box>

          <Box>
            <label className="block text-sm font-medium mb-2">
              Or Upload File
            </label>
            <Input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              accept=".zip,.pdf,.doc,.docx"
            />
          </Box>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

