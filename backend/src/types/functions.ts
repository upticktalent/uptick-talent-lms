import type { Response } from "express";


export type ResponseObjectFn = (props: {
  res: Response;
  statusCode: number;
  message: string;
  payload?: unknown;
  status?: boolean;
}) => void;
