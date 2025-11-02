"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReadiness = exports.getLiveness = exports.getDetailedHealth = exports.getHealth = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Basic health check
 */
const getHealth = async (_req, res, _next) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
};
exports.getHealth = getHealth;
/**
 * Detailed health check — includes DB status, uptime, and memory usage
 */
const getDetailedHealth = async (_req, res, next) => {
    try {
        let dbStatus = "disconnected";
        let isHealthy = false;
        // Check Prisma DB connection
        try {
            await prisma.$queryRaw `SELECT 1;`; // Quick lightweight DB ping
            dbStatus = "connected";
            isHealthy = true;
        }
        catch (dbError) {
            dbStatus = "disconnected";
            isHealthy = false;
        }
        const memoryUsage = process.memoryUsage();
        res.status(isHealthy ? 200 : 503).json({
            success: isHealthy,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: {
                status: dbStatus,
            },
            memory: {
                used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
                total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
                unit: "MB",
            },
            environment: process.env.NODE_ENV || "development",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDetailedHealth = getDetailedHealth;
/**
 * Liveness probe — checks if app is alive
 */
const getLiveness = async (_req, res, _next) => {
    res.status(200).json({
        status: "alive",
        timestamp: new Date().toISOString(),
    });
};
exports.getLiveness = getLiveness;
/**
 * Readiness probe — checks if the app is ready to receive traffic
 */
const getReadiness = async (_req, res, next) => {
    try {
        let isReady = false;
        try {
            await prisma.$queryRaw `SELECT 1;`;
            isReady = true;
        }
        catch {
            isReady = false;
        }
        res.status(isReady ? 200 : 503).json({
            status: isReady ? "ready" : "not ready",
            database: isReady ? "connected" : "not connected",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getReadiness = getReadiness;
