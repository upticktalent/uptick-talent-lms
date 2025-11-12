import { HttpStatusCode } from "../config"
export class CustomApiError extends Error {
    statusCode: number
    constructor(message: string) {
        super(message)
        this.statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR
    }
}