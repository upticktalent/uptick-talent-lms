import { Request, Response, NextFunction } from "express";
import { CustomApiError } from "../Errors/index";
import { HttpStatusCode } from "../config";
import { responseObject } from "../utils/responseObject";

const errorHandlerMiddleWare = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomApiError) {
    return responseObject({
      res,
      statusCode: err.statusCode,
      message: err.message,
      payload: null,
      status: false,
    });
  }

  return responseObject({
    res,
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: "Something went wrong, try again later",
    payload: null,
    status: false,
  });
};

export default errorHandlerMiddleWare;
