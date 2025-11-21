'use client';

import React from 'react';
import { MoreHorizontal, Eye, Send, Calendar, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Applicant, ApplicationStatus } from '@/types/dashboard';

interface ApplicantRowActionsProps {
  applicant: Applicant;
  onView: (applicant: Applicant) => void;
  onSendAssessment: (applicant: Applicant) => void;
  // Add placeholders for future actions
  onScheduleInterview?: (applicant: Applicant) => void;
}

export const ApplicantRowActions: React.FC<ApplicantRowActionsProps> = ({
  applicant,
  onView,
  onSendAssessment,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => onView(applicant)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onSendAssessment(applicant)}>
          <Send className="mr-2 h-4 w-4" />
          Send Assessment
        </DropdownMenuItem>

        {/* Placeholders for next steps */}
        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
          <CheckSquare className="mr-2 h-4 w-4" />
          Evaluate Assessment
        </DropdownMenuItem>

        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Interview
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
