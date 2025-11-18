import express, { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { getters } from "@config";
// import { loadServices } from "./loader";
import { Logger } from "./constants/logger";
import { EnvironmentConfig } from "./constants/environment";
// import router from "./routes/applicants.routes";
import errorHandlerMiddleWare from "./Middlware/ErrorHandlerMiddleware";
// import { ENDPOINTS } from "./constants/endpoints";
import { env } from "./config/dynamicEnv";
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from './utils/i188n';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// Rate limiting - Using global HttpStatusCode
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: EnvironmentConfig.IS_PRODUCTION ? 100 : 1000, // limit each IP
  message: {
    status: HttpStatusCode.TOO_MANY_REQUESTS,
    success: false,
    message: "Too many requests from this IP, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (EnvironmentConfig.IS_PRODUCTION) {
      const allowedOrigins = getters.getAllowedOrigins();
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware with limits
app.use(express.json({
  limit: '10mb' // prevent DOS attacks with large payloads
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Request logging middleware (simple version)
app.use((req: Request, _res: Response, next: NextFunction) => {
  Logger.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

const allowedOrigins = env.ALLOWED_ORIGINS;

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, 
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   })
// );





// // 404 handler - Using global HttpStatusCode
// app.use((_req: Request, res: Response) => {
//   res.status(HttpStatusCode.NOT_FOUND).json({
//     success: false,
//     message: "Route not found",
//     path: _req.path
//   });
// });

// Define proper TypeScript interfaces for error response
interface BaseErrorResponse {
  success: false;
  message: string;
  timestamp: string;
  path: string;
}

interface DevelopmentErrorResponse extends BaseErrorResponse {
  details?: string;
  stack?: string;
  validationErrors?: unknown;
}

interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
  status?: number;
  errors?: unknown;
}

// Global error handler - must be last
const errorHandler: ErrorRequestHandler = (err: PrismaError, req: Request, res: Response, _next: NextFunction) => {
  const timestamp = new Date().toISOString();
  
  // Log error with context using optional chaining
  Logger.error(`[${timestamp}] 🔥 Error:`, {
    message: err?.message,
    stack: err?.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    body: req.body
  });

  // Prisma specific error handling with global status codes
  let statusCode = err?.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  let message = getMessage('errors.internalServer');
  let details: string | undefined = undefined;

  // Handle Prisma errors with optional chaining
  if (err?.code) {
    switch (err.code) {
      case 'P2002':
        statusCode = HttpStatusCode.CONFLICT;
        message = 'Resource already exists with provided unique constraint';
        details = err.meta?.target?.join(', ');
        break;
      case 'P2025':
        statusCode = HttpStatusCode.NOT_FOUND;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = HttpStatusCode.BAD_REQUEST;
        message = 'Invalid foreign key reference';
        break;
      default:
        // Other Prisma errors
        statusCode = HttpStatusCode.BAD_REQUEST;
        message = 'Database operation failed';
    }
  }

  // Handle common HTTP errors
  if (err.name === 'ValidationError') {
    statusCode = HttpStatusCode.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = HttpStatusCode.UNAUTHORIZED;
    message = 'Unauthorized access';
  } else if (err.name === 'ForbiddenError') {
    statusCode = HttpStatusCode.FORBIDDEN;
    message = 'Access forbidden';
  }

  // In production, don't leak error details for server errors
  if (EnvironmentConfig.IS_PRODUCTION && statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
    message = "Internal Server Error";
  }

  // Base error response
  const errorResponse: BaseErrorResponse = {
    success: false,
    message,
    timestamp,
    path: req.path
  };

  // Add development-specific details
  let developmentResponse: BaseErrorResponse | DevelopmentErrorResponse = errorResponse;
  
  if (!EnvironmentConfig.IS_PRODUCTION) {
    developmentResponse = {
      ...errorResponse,
      details: details || err?.message,
      stack: err?.stack,
    };

    if (err?.errors) {
      (developmentResponse as DevelopmentErrorResponse).validationErrors = err.errors;
      statusCode = HttpStatusCode.UNPROCESSABLE_ENTITY;
    }
  }
  responseObject({ 
        res,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: getMessage('Internal server error')
      });

};

app.use(errorHandler);

// Global error handler middleware
app.use(errorHandlerMiddleWare);

export default app;