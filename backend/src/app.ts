


import express, { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { getters } from "@config";
import { loadServices } from "./loader";

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP
  message: {
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
    
    if (process.env.NODE_ENV === "production") {
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Register routes via loader
loadServices(app);

// 404 handler - must be after all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: _req.path
  });
});

// Global error handler - must be last
const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, _next: NextFunction) => {
  const timestamp = new Date().toISOString();
  
  // Log error with context
  console.error(`[${timestamp}] 🔥 Error:`, {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    body: req.body
  });

  // Prisma specific error handling
  let statusCode = err.status || 500;
  let message = 'Internal Server Error';
  let details = undefined;

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists with provided unique constraint';
        details = err.meta?.target;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid foreign key reference';
        break;
      default:
        // Other Prisma errors
        statusCode = 400;
        message = 'Database operation failed';
    }
  }

  // In production, don't leak error details
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Internal Server Error";
  }

  const errorResponse: any = {
    success: false,
    message,
    timestamp,
    path: req.path
  };

  // Add error details in development
  if (process.env.NODE_ENV !== "production") {
    errorResponse.details = details || err.message;
    errorResponse.stack = err.stack;
  }

  // Add validation errors if they exist
  if (err.errors) {
    errorResponse.validationErrors = err.errors;
    statusCode = 422; // Unprocessable Entity
  }

  res.status(statusCode).json(errorResponse);
};

app.use(errorHandler);

export default app;