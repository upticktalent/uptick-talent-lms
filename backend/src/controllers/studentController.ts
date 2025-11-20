// student.controller.ts
import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { Logger } from '../constants/logger';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from '../utils/i188n';

const prisma = new PrismaClient();

// Get student dashboard
export const getStudentDashboard: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const studentId = authReq.user.id;

    const student = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        cohort: true,
        courses: {
          include: {
            mentor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            },
            materials: {
              orderBy: { weekNumber: 'asc' }
            },
            assignments: {
              include: {
                submissions: {
                  where: { studentId },
                  select: {
                    submittedAt: true,
                    grade: true,
                    feedback: true,
                    gradedAt: true
                  }
                }
              },
              orderBy: { dueDate: 'asc' }
            }
          }
        }
      }
    });

    if (!student) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('STUDENT.ERRORS.PROFILE_NOT_FOUND')
      });
    }

    // Get mentor expertise separately
    const mentorExpertise = await prisma.mentorProfile.findMany({
      where: {
        courses: {
          some: {
            students: {
              some: { userId: studentId }
            }
          }
        }
      },
      select: {
        userId: true,
        expertise: true,
        bio: true
      }
    });

    // Calculate upcoming assignments with proper typing
    const upcomingAssignments = student.courses.flatMap(course => 
      course.assignments
        .filter((assignment: any) => 
          new Date(assignment.dueDate) > new Date() &&
          assignment.submissions.length === 0
        )
        .map((assignment: any) => {
          const courseMentor = mentorExpertise.find(m => m.userId === course.mentor?.userId);
          return {
            ...assignment,
            courseTitle: course.title,
            mentor: course.mentor ? {
              ...course.mentor,
              expertise: courseMentor?.expertise || [],
              bio: courseMentor?.bio || null
            } : null
          };
        })
    ).sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
     .slice(0, 5);

    // Calculate recent materials with proper typing
    const recentMaterials = student.courses.flatMap((course: any) =>
      course.materials.map((material: any) => ({
        ...material,
        courseTitle: course.title
      }))
    ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
     .slice(0, 5);

    // Format courses with mentor expertise
    const formattedCourses = student.courses.map((course: any) => {
      const courseMentor = mentorExpertise.find(m => m.userId === course.mentor?.userId);
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        track: course.track,
        mentor: course.mentor ? {
          ...course.mentor,
          expertise: courseMentor?.expertise || [],
          bio: courseMentor?.bio || null
        } : null,
        materialsCount: course.materials.length,
        assignmentsCount: course.assignments.length
      };
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('STUDENT.SUCCESS.DASHBOARD_RETRIEVED'),
      payload: {
        student: {
          id: student.userId,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          track: student.track,
          cohort: student.cohort
        },
        courses: formattedCourses,
        upcomingAssignments,
        recentMaterials,
        stats: {
          totalCourses: student.courses.length,
          totalAssignments: student.courses.reduce((acc: number, course: any) => 
            acc + course.assignments.length, 0
          ),
          submittedAssignments: student.courses.reduce((acc: number, course: any) => 
            acc + course.assignments.filter((a: any) => a.submissions.length > 0).length, 0
          ),
          pendingAssignments: student.courses.reduce((acc: number, course: any) => 
            acc + course.assignments.filter((a: any) => 
              a.submissions.length === 0 && new Date(a.dueDate) > new Date()
            ).length, 0
          )
        }
      }
    });
   
  } catch (error) {
    Logger.error('Get student dashboard error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('STUDENT.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Get specific course details
export const getStudentCourse: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const studentId = authReq.user.id;
    const { courseId } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        students: {
          some: { userId: studentId }
        }
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        },
        materials: {
          orderBy: { weekNumber: 'asc' }
        },
        assignments: {
          include: {
            submissions: {
              where: { studentId },
              select: {
                id: true,
                submittedAt: true,
                grade: true,
                feedback: true,
                gradedAt: true
              }
            }
          },
          orderBy: { dueDate: 'asc' }
        },
        cohort: true
      }
    });

    if (!course) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('STUDENT.ERRORS.COURSE_NOT_FOUND')
      });
    }

    // Get mentor expertise separately
    const mentorExpertise = await prisma.mentorProfile.findUnique({
      where: { userId: course.mentor?.userId || '' },
      select: {
        expertise: true,
        bio: true
      }
    });

    // Format course with mentor expertise
    const formattedCourse = {
      ...course,
      mentor: course.mentor ? {
        ...course.mentor,
        expertise: mentorExpertise?.expertise || [],
        bio: mentorExpertise?.bio || null
      } : null
    };

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('STUDENT.SUCCESS.COURSE_RETRIEVED'),
      payload: { course: formattedCourse }
    });
   
  } catch (error) {
    Logger.error('Get student course error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('STUDENT.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Submit assignment
export const submitAssignment: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const studentId = authReq.user.id;
    const { assignmentId } = req.params;
    const { content, fileUrl } = req.body;

    if (!content && !fileUrl) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('STUDENT.ERRORS.SUBMISSION_CONTENT_REQUIRED')
      });
    }

    // Check if assignment exists and student is enrolled in the course
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        course: {
          students: {
            some: { userId: studentId }
          }
        }
      },
      include: {
        submissions: {
          where: { studentId }
        }
      }
    });

    if (!assignment) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('STUDENT.ERRORS.ASSIGNMENT_NOT_FOUND')
      });
    }

    // Check if already submitted
    if (assignment.submissions.length > 0) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('STUDENT.ERRORS.ASSIGNMENT_ALREADY_SUBMITTED')
      });
    }

    // Check if due date has passed
    if (new Date() > new Date(assignment.dueDate)) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage('STUDENT.ERRORS.ASSIGNMENT_DUE_DATE_PASSED')
      });
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId,
        content,
        fileUrl,
        submittedAt: new Date()
      },
      include: {
        assignment: {
          include: {
            course: true
          }
        }
      }
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage('STUDENT.SUCCESS.ASSIGNMENT_SUBMITTED'),
      payload: { submission }
    });
    
  } catch (error) {
    Logger.error('Submit assignment error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('STUDENT.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Get student assignments
export const getStudentAssignments: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const studentId = authReq.user.id;
    const { status, courseId } = req.query;

    const where: any = {
      course: {
        students: {
          some: { userId: studentId }
        }
      }
    };

    if (courseId) {
      where.courseId = courseId as string;
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: {
          select: {
            title: true,
            track: true
          }
        },
        submissions: {
          where: { studentId },
          select: {
            submittedAt: true,
            grade: true,
            feedback: true,
            gradedAt: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Filter by status if provided ....
    let filteredAssignments = assignments;
    if (status === 'submitted') {
      filteredAssignments = assignments.filter((a: any) => a.submissions.length > 0);
    } else if (status === 'pending') {
      filteredAssignments = assignments.filter((a: any) => 
        a.submissions.length === 0 && new Date(a.dueDate) > new Date()
      );
    } else if (status === 'overdue') {
      filteredAssignments = assignments.filter((a: any) => 
        a.submissions.length === 0 && new Date(a.dueDate) < new Date()
      );
    } else if (status === 'graded') {
      filteredAssignments = assignments.filter((a: any) => 
        a.submissions.length > 0 && a.submissions[0].grade !== null
      );
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('STUDENT.SUCCESS.ASSIGNMENTS_RETRIEVED'),
      payload: { assignments: filteredAssignments }
    });
   
  } catch (error) {
    Logger.error('Get student assignments error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('STUDENT.ERRORS.INTERNAL_SERVER')
    });
  }
};

// Get course materials
export const getCourseMaterials: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const studentId = authReq.user.id;
    const { courseId } = req.params;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        students: {
          some: { userId: studentId }
        }
      },
      include: {
        materials: {
          orderBy: { weekNumber: 'asc' }
        }
      }
    });

    if (!course) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage('STUDENT.ERRORS.COURSE_NOT_FOUND')
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage('STUDENT.SUCCESS.MATERIALS_RETRIEVED'),
      payload: { 
        course: {
          title: course.title,
          description: course.description
        },
        materials: course.materials 
      }
    });
   
  } catch (error) {
    Logger.error('Get course materials error:', error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage('STUDENT.ERRORS.INTERNAL_SERVER')
    });
  }
};