import { MetadataKeys, RequestHandlerDecorator } from "./types";

export function requireAuthentication(): RequestHandlerDecorator {
  return function (target: Function, ctx: ClassMethodDecoratorContext): void {
    Reflect.defineMetadata(MetadataKeys.Authentication, true, target);
  };
}
