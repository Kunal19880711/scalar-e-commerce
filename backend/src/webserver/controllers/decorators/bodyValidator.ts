import "reflect-metadata";
import { use, RequestHandlerDecorator, MetadataKeys } from "express-controller";
import { bodyValidators } from "../../middlewares";

export const bodyValidator = (
  ...requiredFields: string[]
): RequestHandlerDecorator => use(bodyValidators(requiredFields));
