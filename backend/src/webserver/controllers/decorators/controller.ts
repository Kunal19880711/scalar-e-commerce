import path from "node:path";
import "reflect-metadata";
import express, { RequestHandler } from "express";
import { AppRouter } from "../../AppRouter";
import { MetadataKeys, HttpMethods } from "./types";
import { bodyValidators } from "../../middlewares";

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
