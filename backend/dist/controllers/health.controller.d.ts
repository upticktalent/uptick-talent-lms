import { Request, Response, NextFunction } from "express";
/**
 * Basic health check
 */
export declare const getHealth: (_req: Request, res: Response, _next: NextFunction) => Promise<void>;
/**
 * Detailed health check — includes DB status, uptime, and memory usage
 */
export declare const getDetailedHealth: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Liveness probe — checks if app is alive
 */
export declare const getLiveness: (_req: Request, res: Response, _next: NextFunction) => Promise<void>;
/**
 * Readiness probe — checks if the app is ready to receive traffic
 */
export declare const getReadiness: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
