import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Basic health check
 */
export const getHealth = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Detailed health check — includes DB status, uptime, and memory usage
 */
export const getDetailedHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let dbStatus = "disconnected";
    let isHealthy = false;

    // Check Prisma DB connection
    try {
      await prisma.$queryRaw`SELECT 1;`; // Quick lightweight DB ping
      dbStatus = "connected";
      isHealthy = true;
    } catch (dbError) {
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
  } catch (error) {
    next(error);
  }
};

/**
 * Liveness probe — checks if app is alive
 */
export const getLiveness = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Readiness probe — checks if the app is ready to receive traffic
 */
export const getReadiness = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let isReady = false;

    try {
      await prisma.$queryRaw`SELECT 1;`;
      isReady = true;
    } catch {
      isReady = false;
    }

    res.status(isReady ? 200 : 503).json({
      status: isReady ? "ready" : "not ready",
      database: isReady ? "connected" : "not connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
