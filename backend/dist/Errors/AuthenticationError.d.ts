import { CustomApiError } from "./CustomApiError";
export declare class AuthenticationError extends CustomApiError {
    statusCode: number;
    constructor(message: string);
}
