import path from "node:path";
import "reflect-metadata";
import express, { RequestHandler } from "express";
import { AppRouter } from "../../AppRouter";
import { MetadataKeys, HttpMethods } from "./types";
import {
  authentication,
  authorization,
  bodyValidators,
} from "../../middlewares";
import { Roles } from "../../../constants";

export type ControllerConfig = {
  routePrefix: string;
  requireAuthentication?: boolean;
  authorizedRoles?: Roles[];
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

      const authMiddlewares: RequestHandler[] = getAuthMiddlewares(
        config,
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
          path.normalize(`${config.routePrefix}${routePath}`),
          ...authMiddlewares,
          ...middlewares,
          bodyValidator,
          routeHandler
        );
      }
    }
  };
}

function getAuthMiddlewares(
  config: ControllerConfig,
  routeHandler: any
): RequestHandler[] {
  const authMiddlewares: RequestHandler[] = [];

  const controllerNeedAuth = !!config.requireAuthentication;
  const routeNeedAuth = !!Reflect.getMetadata(
    MetadataKeys.Authentication,
    routeHandler
  );

  if (controllerNeedAuth || routeNeedAuth) {
    authMiddlewares.push(authentication);

    // checking for roles
    const rolesFromController: Roles[] = config.authorizedRoles || [];
    const rolesFromRoute: Roles[] =
      Reflect.getMetadata(MetadataKeys.Authorization, routeHandler) || [];
    const authRoles: Roles[] = [...rolesFromController, ...rolesFromRoute];
    if (Array.isArray(authRoles) && authRoles.length > 0) {
      authMiddlewares.push(authorization(authRoles));
    }
  }

  return authMiddlewares;
}
