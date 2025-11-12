"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const _config_1 = require("@config");
const loader_1 = require("./loader");
const logger_1 = require("./constants/logger");
const environment_1 = require("./constants/environment");
const applicants_routes_1 = __importDefault(require("./routes/applicants.routes"));
const ErrorHandlerMiddleware_1 = __importDefault(require("./Middlware/ErrorHandlerMiddleware"));
const endpoints_1 = require("./constants/endpoints");
const dynamicEnv_1 = require("./config/dynamicEnv");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// Compression middleware
app.use((0, compression_1.default)());
// Rate limiting - Fixed message format
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: environment_1.EnvironmentConfig.IS_PRODUCTION ? 100 : 1000, // limit each IP
    message: {
        status: 429,
        success: false,
        message: "Too many requests from this IP, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (environment_1.EnvironmentConfig.IS_PRODUCTION) {
            const allowedOrigins = _config_1.getters.getAllowedOrigins();
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        }
        else {
            // In development, allow all origins
            callback(null, true);
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400, // 24 hours
};
app.use((0, cors_1.default)(corsOptions));
// Body parsing middleware with limits
app.use(express_1.default.json({
    limit: '10mb' // prevent DOS attacks with large payloads
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10mb'
}));
// Request logging middleware (simple version)
app.use((req, _res, next) => {
    logger_1.Logger.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});
// const getProductionOrigins = (): string => {
//   return getters.getAllowedOrigins()
// };
const allowedOrigins = dynamicEnv_1.env.ALLOWED_ORIGINS;
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
// const corsOptions = {
//   origin:
//     process.env.NODE_ENV === "production" ? getters.getAllowedOrigins() : "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   credentials: true,
// };
// app.use(cors(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// routes
app.use(endpoints_1.ENDPOINTS.APPLICANTS, applicants_routes_1.default);
// Register routes via loader
(0, loader_1.loadServices)(app);
// 404 handler - must be after all routes
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: _req.path
    });
});
// Global error handler - must be last
const errorHandler = (err, req, res, _next) => {
    const timestamp = new Date().toISOString();
    // Log error with context using optional chaining
    logger_1.Logger.error(`[${timestamp}] 🔥 Error:`, {
        message: err?.message,
        stack: err?.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        body: req.body
    });
    // Prisma specific error handling
    let statusCode = err?.status || 500;
    let message = 'Internal Server Error';
    let details = undefined;
    // Handle Prisma errors with optional chaining
    if (err?.code) {
        switch (err.code) {
            case 'P2002':
                statusCode = 409;
                message = 'Resource already exists with provided unique constraint';
                details = err.meta?.target?.join(', ');
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
    if (environment_1.EnvironmentConfig.IS_PRODUCTION && statusCode === 500) {
        message = "Internal Server Error";
    }
    // Base error response
    const errorResponse = {
        success: false,
        message,
        timestamp,
        path: req.path
    };
    // Add development-specific details
    let developmentResponse = errorResponse;
    if (!environment_1.EnvironmentConfig.IS_PRODUCTION) {
        developmentResponse = {
            ...errorResponse,
            details: details || err?.message,
            stack: err?.stack,
        };
        // Add validation errors if they exist with optional chaining
        if (err?.errors) {
            developmentResponse.validationErrors = err.errors;
            statusCode = 422; // Unprocessable Entity
        }
    }
    res.status(statusCode).json(developmentResponse);
};
app.use(errorHandler);
// global error handler
app.use(ErrorHandlerMiddleware_1.default);
exports.default = app;
