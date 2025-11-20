'use client';

import React, { useState } from 'react';
import { Search, UserCircle2, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Box from '@/components/ui/box';
import { cn } from '@/lib/utils';

// Placeholder mock data - replace with API call in real implementation
const mockApplicants = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'pending',
    appliedDate: '2024-01-15',
    course: 'Web Development Fundamentals',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    status: 'approved',
    appliedDate: '2024-01-14',
    course: 'Data Science Bootcamp',
  },
  // ... add more mock data as needed
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ApplicantsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplicants = mockApplicants.filter(
    applicant =>
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Box className="space-y-6">
      {/* Stats */}
      <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Applicants</CardDescription>
            <CardTitle className="text-2xl font-bold text-[#477BFF]">
              {mockApplicants.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-2xl font-bold text-[#477BFF]">
              {mockApplicants.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-2xl font-bold text-[#477BFF]">
              {mockApplicants.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Waitlisted</CardDescription>
            <CardTitle className="text-2xl font-bold text-[#477BFF]">
              {mockApplicants.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </Box>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Box>
              <CardTitle>All Applicants</CardTitle>
              <CardDescription className="mt-1">
                View and manage applicant information
              </CardDescription>
            </Box>
            <Box className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </Box>
          </Box>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map(applicant => (
                <TableRow key={applicant.id}>
                  <TableCell>
                    <Box className="flex items-center gap-3">
                      <Box className="w-10 h-10 rounded-full bg-[#477BFF]/10 flex items-center justify-center">
                        <UserCircle2 className="h-6 w-6 text-[#477BFF]" />
                      </Box>
                      <Box>
                        <Box as="p" className="font-medium text-[#000523]">
                          {applicant.name}
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <Box className="flex items-center gap-2">
                        <Mail className="h-3 w-3" /> {applicant.email}
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Phone className="h-3 w-3" /> {applicant.phone}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{applicant.course}</TableCell>
                  <TableCell>{applicant.appliedDate}</TableCell>
                  <TableCell>
                    <Box
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(applicant.status),
                      )}
                    >
                      {applicant.status}
                    </Box>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[#477BFF]">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
