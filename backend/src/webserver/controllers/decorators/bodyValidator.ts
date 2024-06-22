import 'reflect-metadata';
import { RequestHandlerDecorator, MetadataKeys } from './types';

export function bodyValidator(...requiredFields: string[]):  RequestHandlerDecorator {
  return function (target: Function, ctx: ClassMethodDecoratorContext): void {
    Reflect.defineMetadata(MetadataKeys.Validator, requiredFields, target);
  };
}
