"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseObject = void 0;
const responseObject = (props) => {
    const { res, statusCode, message, payload = undefined, status = false, } = props;
    res.set("Cache-Control", "no-store");
    let responseObject = {
        code: statusCode,
        message,
        payload,
    };
    if (statusCode) {
        responseObject = {
            ...responseObject,
            status: statusCode >= 200 && statusCode <= 300,
        };
    }
    if (status) {
        responseObject = {
            ...responseObject,
            status,
        };
    }
    return res.status(statusCode).send(responseObject);
};
exports.responseObject = responseObject;
