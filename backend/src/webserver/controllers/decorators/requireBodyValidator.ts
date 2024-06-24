import "reflect-metadata";
import { use, RequestHandlerDecorator, MetadataKeys } from "express-controller";
import { bodyValidator } from "../../middlewares";

export const requireBodyValidator = (
  ...requiredFields: string[]
): RequestHandlerDecorator => use(bodyValidator(requiredFields));
