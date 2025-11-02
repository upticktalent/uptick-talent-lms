"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// import { connectDatabase } from "./models/db";
const config_1 = require("./config");
const port = config_1.getters.getAppPort();
const startServer = async () => {
    try {
        // Connect to database first
        // await connectDatabase();
        // console.log("✅ Database connected");
        app_1.default.listen(port, () => {
            console.log(`${config_1.getters.geti18ns().LOGS.RUNNING_APP} ${port}`);
            console.log(`🚀 Server: http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
};
// Handle unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});
startServer();
