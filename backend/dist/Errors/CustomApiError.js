"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomApiError = void 0;
const config_1 = require("../config");
class CustomApiError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = config_1.HttpStatusCode.INTERNAL_SERVER_ERROR;
    }
}
exports.CustomApiError = CustomApiError;
