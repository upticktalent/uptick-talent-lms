import dotenv from 'dotenv';
import express from 'express';
import { MainRouter } from './routes';
import { setupSwagger } from './config/swagger';
// Load env vars
dotenv.config();
import app from "./app";
import { getters } from "./config";
import { Logger } from './config/logger';
import { responseObject } from '@utils';
import { HttpStatusCode } from '@config';
import { getMessage } from './utils/i188n';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      Logger.log(`${getters.geti18ns().LOGS.RUNNING_APP} ${PORT}`);
      Logger.log(`🚀 Server: http://localhost:${PORT}`);
    });
  } catch (error) { 
    Logger.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/v1', MainRouter);

// 404 handler - Using responseObject
app.use('*', (req, res) => {
  responseObject({
    res,
    statusCode: HttpStatusCode.NOT_FOUND,
    message: getMessage('LOGS.ROUTES.WILDCARD'),
    status: false,
    payload: {
      path: req.path,
      method: req.method
    }
  });
});

// Error handling middleware - Using responseObject
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  Logger.error('Unhandled error:', err);
  
  const statusCode = err.status || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const message = err.message || getMessage('USERS.ERRORS.INTERNAL_SERVER');
  
  responseObject({
    res,
    statusCode,
    message,
    status: false,
    payload: process.env.NODE_ENV === 'development' ? {
      error: err.message,
      stack: err.stack,
      path: req.path
    } : undefined
  });
});

startServer();