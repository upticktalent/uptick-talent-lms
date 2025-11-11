import { CustomApiError } from "./CustomApiError"
import { HttpStatusCode } from "../config"
export class AuthenticationError extends CustomApiError {
    statusCode: number
    constructor(message: string) {
        super(message)
        this.statusCode = HttpStatusCode.UNAUTHORIZED
    }
}