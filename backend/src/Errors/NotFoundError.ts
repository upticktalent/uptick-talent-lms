import { CustomApiError } from "./CustomApiError"
import { HttpStatusCode } from "../config"

export class NotFoundError extends CustomApiError {
    statusCode: number
    constructor(message: string) {
        super(message)
        this.statusCode = HttpStatusCode.NOT_FOUND
    }
}