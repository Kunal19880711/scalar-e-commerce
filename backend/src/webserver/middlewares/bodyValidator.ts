import { NextFunction, RequestHandler, Request, Response } from "express";
import { ApiError, ErrorDetailType, IErrorDetail } from "../types";
import { HttpStatus } from "../../constants";

export function bodyValidator(requiredFields: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
    try {
      let missingKeyPaths: string[] = [];

      if (!req.body) {
        missingKeyPaths = requiredFields;
      } else {
        const fields: string[] = Object.getOwnPropertyNames(req.body);
        missingKeyPaths = requiredFields.filter(
          (field: string) => !fields.includes(field)
        );
      }

      if (missingKeyPaths.length) {
        const errorDetails: IErrorDetail[] = missingKeyPaths.map(
          (keyPath: string) => ({
            type: ErrorDetailType.ValidationError,
            keyPath,
            errors: [`Path \`${keyPath}\` is required.`],
          })
        );

        next(new ApiError(HttpStatus.BadRequest, errorDetails));
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
