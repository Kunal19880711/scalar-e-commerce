import path from "node:path";
import "reflect-metadata";
import { RequestHandler, Router } from "express";
import { AppRouter } from "../AppRouter";
import { MetadataKeys, HttpMethods } from "./types";

export type ControllerConfig = {
  routePrefix: string;
  router?: Router;
};

export function controller(objOrString: string | ControllerConfig) {
  const config: ControllerConfig =
    typeof objOrString === "string"
      ? { routePrefix: objOrString }
      : objOrString;

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

      if (routePath && httpMethod) {
        const router: Router = config.router || AppRouter.instance;
        // console.log(`${routePrefix}${routePath} registed`);
        router[httpMethod](
          path.normalize(`${config.routePrefix}${routePath}`),
          ...middlewares,
          routeHandler
        );
      }
    }
  };
}
