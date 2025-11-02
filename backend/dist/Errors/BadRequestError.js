"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = void 0;
const CustomApiError_1 = require("./CustomApiError");
const config_1 = require("../config");
class BadRequestError extends CustomApiError_1.CustomApiError {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = config_1.HttpStatusCode.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
