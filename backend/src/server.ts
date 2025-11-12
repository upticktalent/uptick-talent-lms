import dotenv from 'dotenv';
import express from 'express';
import { MainRouter } from './routes';
import { setupSwagger } from './config/swagger';
// Load env vars
dotenv.config();
import app from "./app";
import { getters } from "./config";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`${getters.geti18ns().LOGS.RUNNING_APP} ${PORT}`);
      console.log(`🚀 Server: http://localhost:${PORT}`);
    });
  } catch (error) { 
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/v1', MainRouter);

// Health check route
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Server is running healthy',
//     timestamp: new Date().toISOString()
//   });
// });

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
 
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

startServer();

