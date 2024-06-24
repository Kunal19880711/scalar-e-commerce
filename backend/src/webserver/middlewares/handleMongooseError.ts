import { Request, Response, NextFunction } from "express";
import { ApiError, ErrorDetailType, IApiError, IErrorDetail } from "../types";
import { HttpStatus } from "../../constants";
import mongoose, { Error as MongooseError } from "mongoose";
export function handleMongooseError(
  err: Error | IApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof MongooseError.ValidationError) {
    const errorDetails: IErrorDetail[] = Object.keys(err.errors).map((key) => {
      return {
        type: ErrorDetailType.ValidationError,
        keyPath: key,
        errors: [err.errors[key].message],
      };
    });
    next(new ApiError(HttpStatus.BadRequest, errorDetails));
    return;
  }
}
