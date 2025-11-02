"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../Errors/index");
const config_1 = require("../config");
const errorHandlerMiddleWare = (err, req, res, next) => {
    if (err instanceof index_1.CustomApiError) {
        return res.status(err.statusCode).json({
            msg: err.message
        });
    }
    // fallback for other errors
    console.error(err);
    return res
        .status(config_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
        .send("something went wrong, try again later");
};
exports.default = errorHandlerMiddleWare;
