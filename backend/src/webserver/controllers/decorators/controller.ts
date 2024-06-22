import path from "node:path";
import "reflect-metadata";
import express, {
  NextFunction,
  RequestHandler,
  Request,
  Response,
} from "express";
import { AppRouter } from "../../AppRouter";
import { MetadataKeys, HttpMethods } from "./types";
import { ApiError, ErrorDetailType, IErrorDetail } from "../../types";
import { HttpStatus } from "../../../constants";

function bodyValidators(requiredFields: string[]): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction): void {
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

      next(new ApiError(HttpStatus.BadRequest, "Validation Error", errorDetails));
      return;
    }

    next();
  };
}

export function controller(routePrefix: string) {
  return function (target: Function, ctx: Object) {
    // console.log(
    //   target,
    //   target.prototype,
    //   Object.getOwnPropertyNames(target.prototype)
    // );

    for (let key of Object.getOwnPropertyNames(target.prototype)) {
      const routeHandler = target.prototype[key];
      const routePath = Reflect.getMetadata(MetadataKeys.Path, routeHandler);
      const httpMethod: HttpMethods = Reflect.getMetadata(
        MetadataKeys.HttpMethod,
        routeHandler
      );
      const middlewares: RequestHandler[] =
        Reflect.getMetadata(MetadataKeys.Middleware, routeHandler) || [];

      const requiredFields: string[] =
        Reflect.getMetadata(MetadataKeys.Validator, routeHandler) || [];
      const bodyValidator: RequestHandler = bodyValidators(requiredFields);

      if (routePath && httpMethod) {
        // console.log(`${routePrefix}${routePath} registed`);
        AppRouter.instance[httpMethod](
          path.normalize(`${routePrefix}${routePath}`),
          ...middlewares,
          bodyValidator,
          routeHandler
        );
      }
    }
  };
}
