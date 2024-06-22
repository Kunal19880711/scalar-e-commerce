import { Response } from "express";
import { IHttpStatus } from "../../constants";

export function respondSuccess(
  res: Response,
  httpStatus: IHttpStatus,
  data: any,
  message?: string
) {
  res.status(httpStatus.code).json({
    message: message ? message : httpStatus.message,
    data: data,
  });
}
