import { RequestHandler } from "express";
import { type Request, type Response } from "express";
import {
  PrismaClient,
  Role,
  Track,
  ApplicationStatus,
} from "@prisma/client";
import { Logger } from "../constants/logger";
import { responseObject } from "@utils";
import { HttpStatusCode } from "@config";
import { getMessage } from "../utils/i188n";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();

// Get mentor dashboard overview
export const getMentorDashboard: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;

    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        courses: {
          include: {
            cohort: true,
            students: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
                track: true,
              },
            },
            materials: {
              orderBy: { weekNumber: "asc" },
            },
            assignments: {
              include: {
                _count: {
                  select: {
                    submissions: true,
                  },
                },
                submissions: {
                  include: {
                    student: {
                      select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!mentor) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.PROFILE_NOT_FOUND"),
      });
    }

    // Calculate dashboard statistics
    const totalStudents = mentor.courses.reduce(
      (acc, course) => acc + course.students.length,
      0
    );
    const totalAssignments = mentor.courses.reduce(
      (acc, course) => acc + course.assignments.length,
      0
    );
    const totalSubmissions = mentor.courses.reduce(
      (acc, course) =>
        acc +
        course.assignments.reduce(
          (subAcc, assignment) => subAcc + assignment.submissions.length,
          0
        ),
      0
    );
    const pendingGrading = mentor.courses.reduce(
      (acc, course) =>
        acc +
        course.assignments.reduce(
          (subAcc, assignment) =>
            subAcc +
            assignment.submissions.filter(
              (submission) => submission.grade === null
            ).length,
          0
        ),
      0
    );

    // Get upcoming assignments to grade
    const assignmentsToGrade = await prisma.assignment.findMany({
      where: {
        course: {
          mentorId: mentor.userId,
        },
        submissions: {
          some: {
            grade: null,
          },
        },
      },
      include: {
        course: {
          select: {
            title: true,
          },
        },
        submissions: {
          where: {
            grade: null,
          },
          include: {
            student: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    });

    // Get recent student submissions
    const recentSubmissions = await prisma.assignmentSubmission.findMany({
      where: {
        assignment: {
          course: {
            mentorId: mentor.userId,
          },
        },
      },
      include: {
        assignment: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 10,
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.DASHBOARD_RETRIEVED"),
      payload: {
        mentor: {
          id: mentor.userId,
          firstName: mentor.firstName,
          lastName: mentor.lastName,
          email: mentor.email,
          expertise: mentor.expertise,
          track: mentor.track,
          bio: mentor.bio,
        },
        stats: {
          totalCourses: mentor.courses.length,
          totalStudents,
          totalAssignments,
          totalSubmissions,
          pendingGrading,
        },
        courses: mentor.courses,
        assignmentsToGrade,
        recentSubmissions,
      },
    });
  } catch (error) {
    Logger.error("Get mentor dashboard error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Get mentor's courses
export const getMentorCourses: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { track, cohortId } = req.query;

    const where: any = {
      mentorId,
    };

    if (track) where.track = track as Track;
    if (cohortId) where.cohortId = cohortId as string;

    const courses = await prisma.course.findMany({
      where,
      include: {
        cohort: true,
        students: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            email: true,
            track: true,
          },
        },
        materials: {
          orderBy: { weekNumber: "asc" },
        },
        assignments: {
          include: {
            _count: {
              select: {
                submissions: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.COURSES_RETRIEVED"),
      payload: { courses },
    });
  } catch (error) {
    Logger.error("Get mentor courses error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Create course (for mentor's track)
export const createMentorCourse: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { title, description, cohortId } = req.body as {
      title: string;
      description: string;
      cohortId?: string;
    };

    if (!title || !description) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.COURSE_REQUIRED_FIELDS"),
      });
    }

    // Get mentor profile to determine track
    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
    });

    if (!mentor) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.PROFILE_NOT_FOUND"),
      });
    }

    if (!mentor.track) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.TRACK_NOT_SET"),
      });
    }

    // Verify cohort exists and matches mentor's track if provided
    if (cohortId) {
      const cohort = await prisma.cohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return responseObject({
          res,
          statusCode: HttpStatusCode.NOT_FOUND,
          message: getMessage("MENTOR.ERRORS.COHORT_NOT_FOUND"),
        });
      }

      if (cohort.track !== mentor.track) {
        return responseObject({
          res,
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: getMessage("MENTOR.ERRORS.COHORT_TRACK_MISMATCH"),
        });
      }
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        track: mentor.track,
        cohortId: cohortId || null,
        mentorId,
      },
      include: {
        cohort: true,
        students: true,
        materials: true,
        assignments: true,
      },
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage("MENTOR.SUCCESS.COURSE_CREATED"),
      payload: { course },
    });
  } catch (error: any) {
    Logger.error("Create mentor course error:", error);

    if (error.code === "P2002") {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.COURSE_EXISTS"),
      });
    }

    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Get students in mentor's track
export const getMentorStudents: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { cohortId, courseId, page = 1, limit = 10 } = req.query as {
      cohortId?: string;
      courseId?: string;
      page?: string;
      limit?: string;
    };

    // Get mentor's track
    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
      select: { track: true },
    });

    if (!mentor || !mentor.track) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.TRACK_NOT_SET"),
      });
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {
      track: mentor.track,
    };

    if (cohortId) where.cohortId = cohortId;
    if (courseId) {
      where.courses =  {
        some: { id: courseId }
      };
    }

    const [students, total] = await Promise.all([
      prisma.studentProfile.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              createdAt: true,
            },
          },
          cohort: true,
          courses: {
            where: courseId ? { id: courseId } : undefined,
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.studentProfile.count({ where }),
    ]);

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.STUDENTS_RETRIEVED"),
      payload: {
        students,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    Logger.error("Get mentor students error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Add course material
export const addMentorCourseMaterial: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { courseId } = req.params;
    const { title, description, fileUrl, content, weekNumber } = req.body;

    if (!title || !weekNumber) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.MATERIAL_REQUIRED_FIELDS"),
      });
    }

    // Verify course exists and belongs to mentor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        mentorId,
      },
    });

    if (!course) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.COURSE_NOT_FOUND"),
      });
    }

    const material = await prisma.courseMaterial.create({
      data: {
        title,
        description,
        fileUrl,
        content,
        weekNumber: parseInt(weekNumber),
        courseId,
      },
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage("MENTOR.SUCCESS.MATERIAL_ADDED"),
      payload: { material },
    });
  } catch (error) {
    Logger.error("Add mentor course material error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Create assignment
export const createMentorAssignment: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { courseId } = req.params;
    const { title, description, instructions, dueDate, maxScore } = req.body;

    if (!title || !description || !instructions || !dueDate) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.ASSIGNMENT_REQUIRED_FIELDS"),
      });
    }

    // Verify course exists and belongs to mentor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        mentorId,
      },
    });

    if (!course) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.COURSE_NOT_FOUND"),
      });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        instructions,
        dueDate: new Date(dueDate),
        maxScore: maxScore || 100,
        courseId,
      },
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.CREATED,
      message: getMessage("MENTOR.SUCCESS.ASSIGNMENT_CREATED"),
      payload: { assignment },
    });
  } catch (error) {
    Logger.error("Create mentor assignment error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Grade assignment submission
export const gradeAssignment: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    if (grade === undefined || grade === null) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.GRADE_REQUIRED"),
      });
    }

    // Verify submission exists and belongs to mentor's course
    const submission = await prisma.assignmentSubmission.findFirst({
      where: {
        id: submissionId,
        assignment: {
          course: {
            mentorId,
          },
        },
      },
      include: {
        assignment: {
          select: {
            maxScore: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!submission) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.SUBMISSION_NOT_FOUND"),
      });
    }

    // Validate grade
    if (grade < 0 || grade > (submission.assignment.maxScore || 100)) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: getMessage("MENTOR.ERRORS.INVALID_GRADE_RANGE"),
      });
    }

    const updatedSubmission = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        grade: parseInt(grade),
        feedback,
        gradedAt: new Date(),
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        assignment: {
          select: {
            title: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.ASSIGNMENT_GRADED"),
      payload: { submission: updatedSubmission },
    });
  } catch (error) {
    Logger.error("Grade assignment error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Get assignment submissions for grading
export const getAssignmentSubmissions: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { assignmentId } = req.params;
    const { graded, page = 1, limit = 10 } = req.query as {
      graded?: string;
      page?: string;
      limit?: string;
    };

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Verify assignment belongs to mentor
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        course: {
          mentorId,
        },
      },
    });

    if (!assignment) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.ASSIGNMENT_NOT_FOUND"),
      });
    }

    const where: any = {
      assignmentId,
    };

    if (graded === "true") {
      where.grade = { not: null };
    } else if (graded === "false") {
      where.grade = null;
    }

    const [submissions, total] = await Promise.all([
      prisma.assignmentSubmission.findMany({
        where,
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
        skip,
        take,
      }),
      prisma.assignmentSubmission.count({ where }),
    ]);

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.SUBMISSIONS_RETRIEVED"),
      payload: {
        submissions,
        assignment,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    Logger.error("Get assignment submissions error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Update mentor profile
export const updateMentorProfile: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { expertise, bio } = req.body;

    const mentor = await prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
    });

    if (!mentor) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.PROFILE_NOT_FOUND"),
      });
    }

    const updatedMentor = await prisma.mentorProfile.update({
      where: { userId: mentorId },
      data: {
        expertise: expertise || mentor.expertise,
        bio: bio !== undefined ? bio : mentor.bio,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.PROFILE_UPDATED"),
      payload: { mentor: updatedMentor },
    });
  } catch (error) {
    Logger.error("Update mentor profile error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};

// Get course analytics
export const getCourseAnalytics: RequestHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const mentorId = authReq.user.id;
    const { courseId } = req.params;

    // Verify course belongs to mentor
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        mentorId,
      },
      include: {
        students: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        },
        assignments: {
          include: {
            submissions: {
              include: {
                student: {
                  select: {
                    userId: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return responseObject({
        res,
        statusCode: HttpStatusCode.NOT_FOUND,
        message: getMessage("MENTOR.ERRORS.COURSE_NOT_FOUND"),
      });
    }

    // Calculate analytics
    const totalStudents = course.students.length;
    const totalAssignments = course.assignments.length;
    
    const submissionStats = course.assignments.map(assignment => {
      const totalSubmissions = assignment.submissions.length;
      const gradedSubmissions = assignment.submissions.filter(sub => sub.grade !== null).length;
      const averageGrade = gradedSubmissions > 0 
        ? assignment.submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / gradedSubmissions
        : 0;

      return {
        assignmentId: assignment.id,
        assignmentTitle: assignment.title,
        totalSubmissions,
        gradedSubmissions,
        pendingGrading: totalSubmissions - gradedSubmissions,
        averageGrade: Math.round(averageGrade * 100) / 100,
      };
    });

    const studentPerformance = course.students.map(student => {
      const studentSubmissions = course.assignments.flatMap(assignment =>
        assignment.submissions.filter(sub => sub.student.userId === student.userId)
      );
      
      const gradedSubmissions = studentSubmissions.filter(sub => sub.grade !== null);
      const averageGrade = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / gradedSubmissions.length
        : 0;

      return {
        studentId: student.userId,
        studentName: `${student.firstName} ${student.lastName}`,
        totalSubmissions: studentSubmissions.length,
        gradedSubmissions: gradedSubmissions.length,
        averageGrade: Math.round(averageGrade * 100) / 100,
        completionRate: totalAssignments > 0 ? (studentSubmissions.length / totalAssignments) * 100 : 0,
      };
    });

    responseObject({
      res,
      statusCode: HttpStatusCode.OK,
      message: getMessage("MENTOR.SUCCESS.ANALYTICS_RETRIEVED"),
      payload: {
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
        },
        overview: {
          totalStudents,
          totalAssignments,
          totalSubmissions: course.assignments.reduce((acc, assignment) => acc + assignment.submissions.length, 0),
          averageCompletionRate: totalStudents > 0 
            ? studentPerformance.reduce((acc, student) => acc + student.completionRate, 0) / totalStudents
            : 0,
        },
        assignmentStats: submissionStats,
        studentPerformance,
      },
    });
  } catch (error) {
    Logger.error("Get course analytics error:", error);
    responseObject({
      res,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: getMessage("MENTOR.ERRORS.INTERNAL_SERVER"),
    });
  }
};