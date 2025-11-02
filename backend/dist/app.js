"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const loader_1 = require("./loader");
// Routes
const applicants_routes_1 = __importDefault(require("./routes/applicants.routes"));
// Middleware
const ErrorHandlerMiddleware_1 = __importDefault(require("./Middlware/ErrorHandlerMiddleware"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? config_1.getters.getAllowedOrigins() : "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// routes
app.use('/api/v1/applicants', applicants_routes_1.default);
// Register routes via loader
(0, loader_1.loadServices)(app);
// 404 handler - must be after all routes
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// global error handler
app.use(ErrorHandlerMiddleware_1.default);
exports.default = app;
