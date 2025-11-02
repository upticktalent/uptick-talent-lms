"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    NODE_ENV: process.env.NODE_ENV,
    CURRENT_LANGUAGE: process.env.CURRENT_LANGUAGE,
    APP_PORT: process.env.APP_PORT,
    DATABASE_URI: process.env.DATABASE_URI,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
};
