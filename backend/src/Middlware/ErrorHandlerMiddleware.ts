import { Request, Response, NextFunction } from "express";
import { CustomApiError } from "../Errors/index";
import { HttpStatusCode } from "../config";
const errorHandlerMiddleWare = (err: Error, req: Request, res: Response, next: NextFunction) => {


  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ 
      msg: err.message 
    });
  }

  // fallback for other errors
  console.error(err);
  return res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .send("something went wrong, try again later");
};

export default errorHandlerMiddleWare;
