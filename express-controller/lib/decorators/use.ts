import "reflect-metadata";

import { RequestHandler } from "express";
import { MetadataKeys, RequestHandlerDecorator } from "./types";

export function use(middleware: RequestHandler): RequestHandlerDecorator {
  return function (target: Function, ctx: ClassMethodDecoratorContext): void {
    const middlewares: RequestHandler[] =
      Reflect.getMetadata(MetadataKeys.Middleware, target) || [];
    middlewares.push(middleware);
    Reflect.defineMetadata(MetadataKeys.Middleware, middlewares, target);
  };
}
