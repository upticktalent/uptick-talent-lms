import express from "express";
import cors from "cors";
import { getters } from "./config";
import { loadServices } from "./loader";
// Routes
import router from "./routes/applicants.routes";
// Middleware
import errorHandlerMiddleWare from "./Middlware/ErrorHandlerMiddleware";


const app = express();

const getProductionOrigins = (): string => {
  return getters.getAllowedOrigins();
};

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);





// const corsOptions = {
//   origin:
//     process.env.NODE_ENV === "production" ? getters.getAllowedOrigins() : "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/applicants', router)    

// Register routes via loader
loadServices(app);

// 404 handler - must be after all routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


// global error handler
app.use(errorHandlerMiddleWare);

export default app;
