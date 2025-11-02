"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const CustomApiError_1 = require("./CustomApiError");
const config_1 = require("../config");
class NotFoundError extends CustomApiError_1.CustomApiError {
    statusCode;
    constructor(message) {
        super(message);
        this.statusCode = config_1.HttpStatusCode.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
