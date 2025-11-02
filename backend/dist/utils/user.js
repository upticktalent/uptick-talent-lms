"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(3).trim(),
    lastName: zod_1.z.string().min(3).trim(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
