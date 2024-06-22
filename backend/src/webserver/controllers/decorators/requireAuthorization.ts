import { Roles } from "../../../constants";
import { MetadataKeys, RequestHandlerDecorator } from "./types";

export function requireAuthorization(
  ...roles: Roles[]
): RequestHandlerDecorator {
  return function (target: Function, ctx: ClassMethodDecoratorContext): void {
    Reflect.defineMetadata(MetadataKeys.Authorization, roles, target);
  };
}
