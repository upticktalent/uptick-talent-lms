import { CustomApiError } from "./CustomApiError";
export declare class BadRequestError extends CustomApiError {
    statusCode: number;
    constructor(message: string);
}
