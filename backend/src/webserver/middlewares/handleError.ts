import { Request, Response, NextFunction } from "express";
import { ErrorTypes, IApiError } from "../types";
import { HttpStatus } from "../../constants";
import mongoose from "mongoose";

export function handleError(
  err: Error | IApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }

  if ("type" in err) {
    switch (err.type) {
      case ErrorTypes.ApiError:
        res.status(err.status.code).json({
          message: err.message,
          errorDetails: err.errorDetails,
        });
        break;
      default:
        res.status(HttpStatus.InternalServerError.code).json({
          message: err.message,
        });
        break;
    }
  } else {
    console.error(err.stack);
    res.status(HttpStatus.InternalServerError.code).json({
      message: err.message,
    });
  }
}
