import { CustomApiError } from "./CustomApiError";
import { HttpStatusCode } from "../config";

export class BadRequestError extends CustomApiError {
    statusCode: number
    constructor(message:string) {
        super(message)
        this.statusCode = HttpStatusCode.BAD_REQUEST
    }
}