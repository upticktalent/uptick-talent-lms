import { Request, Response, NextFunction } from "express";
declare const errorHandlerMiddleWare: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export default errorHandlerMiddleWare;
