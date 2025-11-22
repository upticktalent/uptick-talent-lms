'use client';

import React, { useState, useRef } from 'react';
import { Github, Linkedin, Globe, Camera } from 'lucide-react';
import Box from '@/components/ui/box';
import { StudentProfile as StudentProfileType } from '@/types/lms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const mockProfile: StudentProfileType = {
  student: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    track: 'FRONTEND',
    cohort: 'Cohort 2024 - Q1',
    enrollmentDate: '2024-01-15',
  },
  mentor: {
    id: '1',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@upticktalent.com',
    track: 'FRONTEND',
  },
  socialLinks: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    portfolio: 'https://johndoe.dev',
    behance: '',
    dribbble: '',
  },
  bio: 'Passionate frontend developer learning React and modern web technologies.',
  skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
  progress: {
    completedWeeks: 4,
    totalWeeks: 12,
    averageScore: 87,
    totalAssessments: 8,
    completedAssessments: 6,
  },
};

export const StudentProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [formData, setFormData] = useState({
    socialLinks: profile.socialLinks,
    bio: profile.bio || '',
    profilePicture: profile.student.profilePicture || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    // TODO: Replace with actual API call
    setProfile({
      ...profile,
      socialLinks: formData.socialLinks,
      bio: formData.bio,
      student: {
        ...profile.student,
        profilePicture: formData.profilePicture,
      },
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'portfolio':
        return <Globe className="w-5 h-5" />;
      case 'behance':
      case 'dribbble':
        return <Globe className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between">
        <Box>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your profile and social links</p>
        </Box>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'outline' : 'default'}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Box>

      <Box className="bg-card border border-border rounded-lg p-6 space-y-6">
        <Box className="flex items-start gap-6">
          <Box className="relative">
            {isEditing ? (
              <Box className="relative">
                <Box
                  className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {profile.student.firstName[0]}
                      {profile.student.lastName[0]}
                    </span>
                  )}
                </Box>
                <Box className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                  <Camera className="w-4 h-4" />
                </Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </Box>
            ) : (
              <Box className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {profile.student.profilePicture ? (
                  <img
                    src={profile.student.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {profile.student.firstName[0]}
                    {profile.student.lastName[0]}
                  </span>
                )}
              </Box>
            )}
          </Box>
          <Box className="flex-1">
            <h2 className="text-2xl font-bold">
              {profile.student.firstName} {profile.student.lastName}
            </h2>
            <p className="text-muted-foreground">{profile.student.email}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {profile.student.track} • {profile.student.cohort}
            </p>
          </Box>
        </Box>

        <Box>
          <h3 className="font-semibold mb-2">Bio</h3>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-muted-foreground">{profile.bio || 'No bio added yet.'}</p>
          )}
        </Box>

        <Box>
          <h3 className="font-semibold mb-4">Progress Overview</h3>
          <Box className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Box className="p-4 bg-accent rounded-lg">
              <p className="text-2xl font-bold">
                {profile.progress.completedWeeks}/{profile.progress.totalWeeks}
              </p>
              <p className="text-sm text-muted-foreground">Weeks Completed</p>
            </Box>
            <Box className="p-4 bg-accent rounded-lg">
              <p className="text-2xl font-bold">{profile.progress.averageScore}%</p>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </Box>
            <Box className="p-4 bg-accent rounded-lg">
              <p className="text-2xl font-bold">
                {profile.progress.completedAssessments}/{profile.progress.totalAssessments}
              </p>
              <p className="text-sm text-muted-foreground">Assessments</p>
            </Box>
            <Box className="p-4 bg-accent rounded-lg">
              <p className="text-2xl font-bold">
                {Math.round((profile.progress.completedWeeks / profile.progress.totalWeeks) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </Box>
          </Box>
        </Box>

        {profile.skills && profile.skills.length > 0 && (
          <Box>
            <h3 className="font-semibold mb-2">Skills</h3>
            <Box className="flex flex-wrap gap-2">
              {profile.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </Box>
          </Box>
        )}

        <Box>
          <h3 className="font-semibold mb-4">Social Links</h3>
          {isEditing ? (
            <Box className="space-y-4">
              <Box>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <Input
                  type="url"
                  value={formData.socialLinks.github || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/username"
                />
              </Box>
              <Box>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <Input
                  type="url"
                  value={formData.socialLinks.linkedin || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </Box>
              <Box>
                <label className="block text-sm font-medium mb-2">Portfolio</label>
                <Input
                  type="url"
                  value={formData.socialLinks.portfolio || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, portfolio: e.target.value },
                    })
                  }
                  placeholder="https://yourportfolio.com"
                />
              </Box>
              <Box>
                <label className="block text-sm font-medium mb-2">Behance</label>
                <Input
                  type="url"
                  value={formData.socialLinks.behance || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, behance: e.target.value },
                    })
                  }
                  placeholder="https://behance.net/username"
                />
              </Box>
              <Box>
                <label className="block text-sm font-medium mb-2">Dribbble</label>
                <Input
                  type="url"
                  value={formData.socialLinks.dribbble || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, dribbble: e.target.value },
                    })
                  }
                  placeholder="https://dribbble.com/username"
                />
              </Box>
              <Button onClick={handleSave}>Save Changes</Button>
            </Box>
          ) : (
            <Box className="flex flex-wrap gap-4">
              {Object.entries(profile.socialLinks).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    {getSocialIcon(platform)}
                    <span className="capitalize">{platform}</span>
                  </a>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
