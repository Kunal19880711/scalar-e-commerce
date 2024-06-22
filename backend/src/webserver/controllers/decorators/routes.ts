import "reflect-metadata";
import { MetadataKeys, HttpMethods, RequestHandlerDecorator } from "./types";
import { RequestHandler } from "express";

type RouteHandlerDecoratorFactory = (
  httpMethod: string
) => RequestHandlerDecorator;

function routeBinder(httpMethod: string): RouteHandlerDecoratorFactory {
  return function (path: string): RequestHandlerDecorator {
    return function (
      target: RequestHandler,
      ctx: ClassMethodDecoratorContext
    ): void {
      Reflect.defineMetadata(MetadataKeys.Path, path, target);
      Reflect.defineMetadata(MetadataKeys.HttpMethod, httpMethod, target);
    };
  };
}

export const get = routeBinder(HttpMethods.Get);
export const post = routeBinder(HttpMethods.Post);
export const put = routeBinder(HttpMethods.Put);
export const del = routeBinder(HttpMethods.Delete);
export const options = routeBinder(HttpMethods.Options);
export const patch = routeBinder(HttpMethods.Patch);
