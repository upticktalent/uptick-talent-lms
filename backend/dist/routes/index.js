"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = void 0;
const health_routes_1 = __importDefault(require("./health.routes"));
exports.health = health_routes_1.default;
exports.default = { health: health_routes_1.default };
