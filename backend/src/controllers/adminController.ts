import { RequestHandler } from 'express';
import { PrismaClient, Role, Track, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { emailService } from '../services/email.service';
import { Logger } from '../constants/logger';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../utils/i188n';

import { EnvironmentConfig } from '../constants/environment';
import { PASSWORD_CONSTANTS } from '../constants/password';

const prisma = new PrismaClient();

const generateRandomPassword = (length: number = PASSWORD_CONSTANTS.DEFAULT_LENGTH): string => {
  let password = '';
  for (let i = 0; i < length; i++) {
    password += PASSWORD_CONSTANTS.CHARSET.charAt(
      Math.floor(Math.random() * PASSWORD_CONSTANTS.CHARSET.length)
    );
  }
  return password;
};

// Cohort Management
export const createCohort: RequestHandler = async (req, res) => {
  try {
    const { name, track, startDate, endDate, description } = req.body;

    if (!name || !track || !startDate || !endDate) {
      return responseObject({ 
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.COHORT_REQUIRED_FIELDS')
      });
    }

    const cohort = await prisma.cohort.create({
      data: {
        name,
        track,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description
      }
    });

    responseObject({  
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage('ADMIN.SUCCESS.COHORT_CREATED'),
      payload: { cohort }
    });
   
  } catch (error: any) {
    Logger.error('Create cohort error:', error);
    
    if (error.code === 'P2002') {
      return responseObject({ 
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.COHORT_EXISTS')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const getCohorts: RequestHandler = async (req, res) => {
  try {
    const { track, active } = req.query;

    const where: any = {};
    if (track) where.track = track;
    if (active !== undefined) where.isActive = active === 'true';

    const cohorts = await prisma.cohort.findMany({
      where,
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        courses: {
          include: {
            mentor: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.COHORTS_RETRIEVED'),
      payload: { cohorts }
    });
  
  } catch (error) {
    Logger.error('Get cohorts error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// User Creation with Email
export const createStudentAccount: RequestHandler = async (req, res) => {
  try {
    const { email, firstName, lastName, track, cohortId } = req.body;

    if (!email || !firstName || !lastName || !track) {
      return responseObject({ 
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.STUDENT_REQUIRED_FIELDS')
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    // Generate temporary password
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

    // Create user (student profile created separately to match generated Prisma types)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: Role.STUDENT
      }
    });

    // Create student profile linked to the created user
    const student = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        email,
        firstName,
        lastName,
        track,
        cohortId
      }
    });

    // Send credentials email
    const emailSent = await emailService.sendCredentialsEmail(
      email,
      firstName,
      temporaryPassword,
      'STUDENT'
    );

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage('ADMIN.SUCCESS.STUDENT_CREATED'),
      payload: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          student
        },
        temporaryPassword: EnvironmentConfig.IS_DEVELOPMENT ? temporaryPassword : undefined,
        emailSent
      }
    });
   
  } catch (error: any) {
    Logger.error('Create student error:', error);
    
    if (error.code === 'P2002') {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const createMentorAccount: RequestHandler = async (req, res) => {
  try {
    const { email, firstName, lastName, expertise, track, bio } = req.body;

    if (!email || !firstName || !lastName) {
      return responseObject({ 
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.MENTOR_REQUIRED_FIELDS')
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    // Generate temporary password
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(temporaryPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

    // Create user (mentor profile created separately to match generated Prisma types)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: Role.MENTOR
      }
    });

    // Create mentor profile linked to the created user
    const mentor = await prisma.mentorProfile.create({
      data: {
        userId: user.id,
        email,
        firstName,
        lastName,
        expertise: expertise || [],
        track,
        bio
      }
    });

    // Send credentials email
    const emailSent = await emailService.sendCredentialsEmail(
      email,
      firstName,
      temporaryPassword,
      'MENTOR'
    );

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage('ADMIN.SUCCESS.MENTOR_CREATED'),
      payload: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          mentor
        },
        temporaryPassword: EnvironmentConfig.IS_DEVELOPMENT ? temporaryPassword : undefined,
        emailSent
      }
    });
   
  } catch (error: any) {
    Logger.error('Create mentor error:', error);
    
    if (error.code === 'P2002') {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Course Management
export const createCourse: RequestHandler = async (req, res) => {
  try {
    const { title, description, track, cohortId, mentorId } = req.body;

    if (!title || !description || !track || !cohortId) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.COURSE_REQUIRED_FIELDS')
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        track,
        cohortId,
        mentorId
      },
      include: {
        cohort: true,
        mentor: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage('ADMIN.SUCCESS.COURSE_CREATED'),
      payload: { course }
    });
    
  } catch (error) {
    Logger.error('Create course error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

export const getCourses: RequestHandler = async (req, res) => {
  try {
    const { track, cohortId } = req.query;

    const where: any = {};
    if (track) where.track = track;
    if (cohortId) where.cohortId = cohortId;

    const courses = await prisma.course.findMany({
      where,
      include: {
        cohort: true,
        mentor: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            expertise: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.COURSES_RETRIEVED'),
      payload: { courses }
    });
   
  } catch (error) {
    Logger.error('Get courses error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Get Users by Track
export const getUsersByTrack: RequestHandler = async (req, res) => {
  try {
    const { track, role } = req.query;

    if (!track) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.TRACK_REQUIRED')
      });
    }

    let users: any[] = [];

    if (role === 'STUDENT' || !role) {
      const students = await prisma.studentProfile.findMany({
        where: { track: track as Track },
        include: {
          user: {
            select: {
              email: true,
              createdAt: true
            }
          },
          cohort: {
            select: {
              name: true
            }
          }
        }
      });
      users = [...users, ...students.map(s => ({ ...s, role: 'STUDENT' }))];
    }

    if (role === 'MENTOR' || !role) {
      const mentors = await prisma.mentorProfile.findMany({
        where: { track: track as Track },
        include: {
          user: {
            select: {
              email: true,
              createdAt: true
            }
          },
          courses: {
            select: {
              title: true
            }
          }
        }
      });
      users = [...users, ...mentors.map(m => ({ ...m, role: 'MENTOR' }))];
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.USERS_BY_TRACK_RETRIEVED'),
      payload: { users }
    });
  } catch (error) {
    Logger.error('Get users by track error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Email Applicants
export const emailApplicants: RequestHandler = async (req, res) => {
  try {
    const { applicantIds, subject, message, status, notes } = req.body;

    if (!applicantIds || !subject || !message) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.EMAIL_REQUIRED_FIELDS')
      });
    }

    const applicants = await prisma.applicant.findMany({
      where: {
        id: { in: applicantIds }
      }
    });

    if (applicants.length === 0) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.NO_APPLICANTS_FOUND')
      });
    }

    // Update application status if provided
    if (status) {
      await prisma.applicant.updateMany({
        where: { id: { in: applicantIds } },
        data: { applicationStatus: status }
      });
    }

    // Send emails
    const emailRecipients = applicants.map(app => app.email);
    const result = await emailService.sendBulkEmail(emailRecipients, subject, message);

    // If status update was requested, send individual status emails
    if (status) {
      for (const applicant of applicants) {
        await emailService.sendApplicationStatusEmail(
          applicant.email,
          applicant.firstname,
          status,
          notes
        );
      }
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.EMAILS_SENT'),
      payload: {
        totalSent: result.success.length,
        totalFailed: result.failed.length,
        failedEmails: result.failed
      }
    });
  
  } catch (error) {
    Logger.error('Email applicants error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Get all applicants with filtering
export const getApplicants: RequestHandler = async (req, res) => {
  try {
    const {
      status,
      track,
      referralSource,
      dateFrom,
      dateTo,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    
    if (status) where.applicationStatus = status;
    if (track) where.track = track;
    if (referralSource) where.referralSource = referralSource;
    
    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
      if (dateTo) where.createdAt.lte = new Date(dateTo as string);
    }

    // Search filter
    if (search) {
      where.OR = [
        { firstname: { contains: search as string, mode: 'insensitive' } },
        { lastname: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [applicants, total] = await Promise.all([
      prisma.applicant.findMany({
        where,
        include: {
          assessment: true,
          interview: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.applicant.count({ where })
    ]);

    // Get application statistics
    const stats = await prisma.applicant.groupBy({
      by: ['applicationStatus'],
      _count: {
        id: true
      }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.APPLICANTS_RETRIEVED'),
      payload: {
        applicants,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        },
        stats
      }
    });
  } catch (error) {
    Logger.error('Get applicants error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Send assessment/task to selected applicants
export const sendAssessment: RequestHandler = async (req, res) => {
  try {
    const { applicantIds, assessmentLink, dueDate, instructions } = req.body;

    if (!applicantIds || !assessmentLink) {
      return responseObject({ 
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.ASSESSMENT_REQUIRED_FIELDS')
      });
    }

    const applicants = await prisma.applicant.findMany({
      where: {
        id: { in: applicantIds },
        applicationStatus: {
          in: ['REVIEWED', 'SHORTLISTED']
        }
      }
    });

    if (applicants.length === 0) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.NO_ELIGIBLE_APPLICANTS')
      });
    }

    const results = [];
    const emailRecipients = [];

    for (const applicant of applicants) {
      try {
        // Create or update assessment
        const assessment = await prisma.assessment.upsert({
          where: { applicantId: applicant.id },
          update: {
            assessmentLink,
            sentAt: new Date(),
            ...(dueDate && { dueDate: new Date(dueDate) })
          },
          create: {
            applicantId: applicant.id,
            assessmentLink,
            sentAt: new Date(),
            ...(dueDate && { dueDate: new Date(dueDate) })
          }
        });

        // Update applicant status
        await prisma.applicant.update({
          where: { id: applicant.id },
          data: { applicationStatus: 'ASSESSMENT_SENT' }
        });

        // Prepare email data
        const trackSpecificInstructions = getTrackInstructions(applicant.track, instructions);
        
        emailRecipients.push({
          email: applicant.email,
          name: `${applicant.firstname} ${applicant.lastname}`,
          track: applicant.track,
          assessmentLink,
          dueDate,
          instructions: trackSpecificInstructions
        });

        results.push({
          applicantId: applicant.id,
          name: `${applicant.firstname} ${applicant.lastname}`,
          email: applicant.email,
          status: 'success'
        });
      } catch (error: any) {
        results.push({
          applicantId: applicant.id,
          name: `${applicant.firstname} ${applicant.lastname}`,
          email: applicant.email,
          status: 'failed',
          error: error.message
        });
      }
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.ASSESSMENT_SENT'),
      payload: {
        results
      }
    });
  } catch (error) {
    Logger.error('Send assessment error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Track assessment progress
export const getAssessmentProgress: RequestHandler = async (req, res) => {
  try {
    const { track, status, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      assessment: { isNot: null }
    };

    if (track) where.track = track;
    if (status) {
      if (status === 'SUBMITTED') {
        where.assessment = { submittedAt: { not: null } };
      } else if (status === 'PENDING') {
        where.assessment = { submittedAt: null };
      }
    }

    const [applicants, total] = await Promise.all([
      prisma.applicant.findMany({
        where,
        include: {
          assessment: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.applicant.count({ where })
    ]);

    // Calculate submission rates
    const totalWithAssessment = await prisma.applicant.count({
      where: { assessment: { isNot: null } }
    });

    const submittedCount = await prisma.applicant.count({
      where: { assessment: { submittedAt: { not: null } } }
    });

    const submissionRate = totalWithAssessment > 0 
      ? (submittedCount / totalWithAssessment) * 100 
      : 0;
      
    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.ASSESSMENT_PROGRESS_RETRIEVED'),
      payload: {
        applicants,
        statistics: {
          totalAssessmentsSent: totalWithAssessment,
          totalSubmitted: submittedCount,
          submissionRate: Math.round(submissionRate),
          pendingSubmissions: totalWithAssessment - submittedCount
        },
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
   
  } catch (error) {
    Logger.error('Get assessment progress error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Evaluate assessment and move to next stage
// export const evaluateAssessment: RequestHandler = async (req, res) => {
//   try {
//     const { applicantId, score, feedback, passed, nextStage } = req.body;

//     if (!applicantId || passed === undefined) {
//       return responseObject({
//         res,
//         statusCode: HttpStatusCode.BAD_REQUEST,
//         message: getMessage('ADMIN.ERRORS.EVALUATION_REQUIRED_FIELDS')
//       });
//     }

//     const applicant = await prisma.applicant.findUnique({
//       where: { id: applicantId },
//       include: { assessment: true }
//     });

//     if (!applicant || !applicant.assessment) {
//       return responseObject({
//         res,
//         statusCode: HttpStatusCode.NOT_FOUND,
//         message: getMessage('ADMIN.ERRORS.APPLICANT_ASSESSMENT_NOT_FOUND')
//       });
//     }

//     // Update assessment with evaluation
//     await prisma.assessment.update({
//       where: { applicantId },
//       data: {
//         reviewedAt: new Date(),
//       }
//     });

//     // Determine next status
//     let nextStatus: ApplicationStatus;
//     if (passed) {
//       nextStatus = nextStage === 'INTERVIEW' ? 'INTERVIEW_SCHEDULED' : 'ACCEPTED';
//     } else {
//       nextStatus = 'REJECTED';
//     }

//     // Update applicant status
//     await prisma.applicant.update({
//       where: { id: applicantId },
//       data: { applicationStatus: nextStatus }
//     });

//     responseObject({
//       res,
//       statusCode: HttpStatusCode.OK,
//       message: passed 
//         ? getMessage('ADMIN.SUCCESS.ASSESSMENT_PASSED') 
//         : getMessage('ADMIN.SUCCESS.ASSESSMENT_FAILED'),
//       payload: {
//         applicantId,
//         status: nextStatus,
//         passed
//       }
//     });
  
//   } catch (error) {
//     Logger.error('Evaluate assessment error:', error);
//     responseObject({
//       res,
//       statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
//       message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
//     });
//   }
// };

export const evaluateAssessment: RequestHandler = async (req, res) => {
  try {
    const { applicantId, score, feedback, passed } = req.body;

    if (!applicantId || passed === undefined) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.EVALUATION_REQUIRED_FIELDS')
      });
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: { assessment: true }
    });

    if (!applicant || !applicant.assessment) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.APPLICANT_ASSESSMENT_NOT_FOUND')
      });
    }

    // Update assessment with evaluation
    await prisma.assessment.update({
      where: { applicantId },
      data: {
       
        reviewedAt: new Date(),
      }
    });

    // Determine next status based on result
    let nextStatus: ApplicationStatus;
    if (passed) {
      nextStatus = 'SHORTLISTED'; // Ready for interview scheduling
    } else {
      nextStatus = 'REJECTED';
    }

    // Update applicant status
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { applicationStatus: nextStatus }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: passed 
        ? getMessage('ADMIN.SUCCESS.ASSESSMENT_PASSED') 
        : getMessage('ADMIN.SUCCESS.ASSESSMENT_FAILED'),
      payload: {
        applicantId,
        status: nextStatus,
        passed,
        nextStep: passed ? 'Schedule interview for this applicant' : 'Application rejected'
      }
    });
  } catch (error) {
    Logger.error('Evaluate assessment error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Create student account from successful applicant
export const createStudentFromApplicant: RequestHandler = async (req, res) => {
  try {
    const { applicantId, cohortId } = req.body;

    if (!applicantId) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.APPLICANT_ID_REQUIRED')
      });
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId }
    });

    if (!applicant) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.APPLICANT_NOT_FOUND')
      });
    }

    // Use your existing createUser function logic
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

    // Create user (student profile created separately because the UserCreateInput does not have a 'student' nested field)
    const user = await prisma.user.create({
      data: {
        email: applicant.email,
        password: hashedPassword,
        firstName: applicant.firstname,
        lastName: applicant.lastname,
        role: Role.STUDENT
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    // Create the student profile linked to the created user
    const student = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        email: applicant.email,
        firstName: applicant.firstname,
        lastName: applicant.lastname,
        track: applicant.track,
        cohortId
      }
    });

    // Update applicant status to ACCEPTED
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { applicationStatus: 'ACCEPTED' }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage('ADMIN.SUCCESS.STUDENT_CREATED_FROM_APPLICANT'),
      payload: {
        user,
        student,
        temporaryPassword: EnvironmentConfig.IS_DEVELOPMENT ? randomPassword : undefined
      }
    });
   
  } catch (error: any) {
    Logger.error('Create student from applicant error:', error);
    
    if (error.code === 'P2002') {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Bulk create student accounts from successful applicants
export const bulkCreateStudents: RequestHandler = async (req, res) => {
  try {
    const { applicantIds, cohortId } = req.body;

    if (!applicantIds || !Array.isArray(applicantIds)) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.APPLICANT_IDS_REQUIRED')
      });
    }

    const results = [];
    const failed = [];

    for (const applicantId of applicantIds) {
      try {
        const applicant = await prisma.applicant.findUnique({
          where: { id: applicantId }
        });

        if (!applicant) {
          failed.push({ applicantId, error: getMessage('ADMIN.ERRORS.APPLICANT_NOT_FOUND') });
          continue;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: applicant.email }
        });

        if (existingUser) {
          failed.push({ applicantId, error: getMessage('USERS.ERRORS.EMAIL_EXISTS') });
          continue;
        }

        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

        const user = await prisma.user.create({
          data: {
            email: applicant.email,
            password: hashedPassword,
            firstName: applicant.firstname,
            lastName: applicant.lastname,
            role: Role.STUDENT
          }
        });

        // Create the related student profile separately (the generated Prisma types expect this)
        await prisma.studentProfile.create({
          data: {
            userId: user.id,
            email: applicant.email,
            firstName: applicant.firstname,
            lastName: applicant.lastname,
            track: applicant.track,
            cohortId
          }
        });

        await prisma.applicant.update({
          where: { id: applicantId },
          data: { applicationStatus: 'ACCEPTED' }
        });

        results.push({
          applicantId,
          userId: user.id,
          email: applicant.email,
          name: `${applicant.firstname} ${applicant.lastname}`,
          track: applicant.track
        });
      } catch (error: any) {
        failed.push({
          applicantId,
          error: error.message
        });
      }
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.BULK_STUDENT_CREATION_COMPLETED'),
      payload: {
        successful: results,
        failed
      }
    });
    
  } catch (error) {
    Logger.error('Bulk create students error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Get admin dashboard statistics
export const getAdminDashboard: RequestHandler = async (req, res) => {
  try {
    const [
      totalApplicants,
      applicantsByStatus,
      applicantsByTrack,
      totalStudents,
      totalMentors,
      recentApplicants,
      assessmentStats,
      totalCohorts
    ] = await Promise.all([
      prisma.applicant.count(),
      prisma.applicant.groupBy({
        by: ['applicationStatus'],
        _count: { id: true }
      }),
      prisma.applicant.groupBy({
        by: ['track'],
        _count: { id: true }
      }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'MENTOR' } }),
      prisma.applicant.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { assessment: true }
      }),
      prisma.assessment.aggregate({
        _count: { id: true }
      }),
      prisma.cohort.count()
    ]);

    const acceptedApplicants = await prisma.applicant.count({ 
      where: { applicationStatus: 'ACCEPTED' } 
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.DASHBOARD_DATA_RETRIEVED'),
      payload: {
        overview: {
          totalApplicants,
          totalStudents,
          totalMentors,
          totalCohorts,
          acceptanceRate: totalApplicants > 0 ?
            (acceptedApplicants / totalApplicants) * 100 : 0
        },
        applicantsByStatus,
        applicantsByTrack,
        assessmentStats,
        recentApplicants
      }
    });
   
  } catch (error) {
    Logger.error('Get admin dashboard error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Update applicant status
export const updateApplicantStatus: RequestHandler = async (req, res) => {
  try {
    const { applicantId, status, notes } = req.body;

    if (!applicantId || !status) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.STATUS_UPDATE_REQUIRED_FIELDS')
      });
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId }
    });

    if (!applicant) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.APPLICANT_NOT_FOUND')
      });
    }

    const updatedApplicant = await prisma.applicant.update({
      where: { id: applicantId },
      data: { 
        applicationStatus: status,
        ...(notes && { notes })
      },
      include: {
        assessment: true,
        interview: true
      }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('ADMIN.SUCCESS.APPLICANT_STATUS_UPDATED'),
      payload: { applicant: updatedApplicant }
    });
   
  } catch (error) {
    Logger.error('Update applicant status error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};


// NEW: Evaluate Interview and Create Student Account
export const evaluateInterview: RequestHandler = async (req, res) => {
  try {
    const { applicantId, passed, score, feedback, cohortId, interviewNotes } = req.body;

    if (!applicantId || passed === undefined) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('ADMIN.ERRORS.INTERVIEW_EVALUATION_REQUIRED')
      });
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: { 
        interview: true,
        assessment: true 
      }
    });

    if (!applicant) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.APPLICANT_NOT_FOUND')
      });
    }

    if (!applicant.interview) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Applicant does not have a scheduled interview'
      });
    }

    if (passed) {
      // Check if user already exists (in case of duplicate)
      const existingUser = await prisma.user.findUnique({
        where: { email: applicant.email }
      });

      if (existingUser) {
        return responseObject({
          res,
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
        });
      }

      // Generate temporary password
      const temporaryPassword = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(temporaryPassword, PASSWORD_CONSTANTS.SALT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: applicant.email,
          password: hashedPassword,
          firstName: applicant.firstname,
          lastName: applicant.lastname,
          role: Role.STUDENT
        }
      });

      // Create student profile
      const student = await prisma.studentProfile.create({
        data: {
          userId: user.id,
          email: applicant.email,
          firstName: applicant.firstname,
          lastName: applicant.lastname,
          track: applicant.track,
          cohortId: cohortId || null
        }
      });

      // Update applicant status to ACCEPTED
      await prisma.applicant.update({
        where: { id: applicantId },
        data: { applicationStatus: 'ACCEPTED' }
      });

      // Update interview record with results
      await prisma.interview.update({
        where: { applicantId },
        data: {
          status: 'ACCEPTED',
          notes: interviewNotes || feedback || 'Interview passed - student account created'
        }
      });

      // Send credentials email to the applicant
      const emailSent = await emailService.sendCredentialsEmail(
        applicant.email,
        applicant.firstname,
        temporaryPassword,
        'STUDENT'
      );

      responseObject({
        res,
        statusCode: HttpStatusCode.OK,
        message: getMessage('ADMIN.SUCCESS.INTERVIEW_PASSED'),
        payload: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          student,
          temporaryPassword: EnvironmentConfig.IS_DEVELOPMENT ? temporaryPassword : undefined,
          emailSent
        }
      });
    } else {
      // Interview failed - update status to rejected
      await prisma.applicant.update({
        where: { id: applicantId },
        data: { applicationStatus: 'REJECTED' }
      });

      // Update interview record
      await prisma.interview.update({
        where: { applicantId },
        data: {
          status: 'REJECTED',
          notes: interviewNotes || feedback || 'Interview failed'
        }
      });

      responseObject({
        res,
        statusCode: HttpStatusCode.OK,
        message: getMessage('ADMIN.SUCCESS.INTERVIEW_FAILED'),
        payload: {
          applicantId,
          status: 'REJECTED'
        }
      });
    }
  } catch (error: any) {
    Logger.error('Evaluate interview error:', error);
    
    if (error.code === 'P2002') {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('USERS.ERRORS.EMAIL_EXISTS')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};


export const scheduleInterview: RequestHandler = async (req, res) => {
  try {
    const { applicantId, interviewDate, notes } = req.body;

    if (!applicantId || !interviewDate) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Applicant ID and interview date are required'
      });
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId }
    });

    if (!applicant) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('ADMIN.ERRORS.APPLICANT_NOT_FOUND')
      });
    }

    // Create or update interview
    const interview = await prisma.interview.upsert({
      where: { applicantId },
      update: {
        interviewDate: new Date(interviewDate),
        notes,
        status: 'INTERVIEW_SCHEDULED'
      },
      create: {
        applicantId,
        interviewDate: new Date(interviewDate),
        notes,
        status: 'INTERVIEW_SCHEDULED'
      }
    });

    // Update applicant status
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { applicationStatus: 'INTERVIEW_SCHEDULED' }
    });

    // Send interview invitation email
    const emailSent = await emailService.sendInterviewInvitation(
      applicant.email,
      applicant.firstname,
      interviewDate,
      notes
    );

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: 'Interview scheduled successfully',
      payload: {
        interview,
        emailSent
      }
    });
  } catch (error: any) {
    Logger.error('Schedule interview error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('ADMIN.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Helper functions
const getTrackInstructions = (track: Track, generalInstructions?: string) => {
  const trackInstructions: { [key in Track]?: string } = {
    [Track.FRONTEND]: 'Please focus on responsive design and modern JavaScript frameworks.',
    [Track.BACKEND]: 'Emphasize API design, database optimization, and security practices.',
    [Track.FULLSTACK_DEVELOPMENT]: 'Showcase both frontend and backend skills with proper integration.',
    [Track.DATA_SCIENCE]: 'Include data analysis, visualization, and machine learning components.',
    [Track.UI_DESIGN]: 'Focus on design principles, typography, and color theory.',
    [Track.UX_DESIGN]: 'Emphasize user research, wireframing, and usability testing.'
  };

  const specificInstructions = trackInstructions[track] || 'Complete the assessment based on your track requirements.';
  
  return generalInstructions 
    ? `${generalInstructions}\n\n${specificInstructions}`
    : specificInstructions;
};

