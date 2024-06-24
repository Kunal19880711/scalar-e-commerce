import "reflect-metadata";
import { use, RequestHandlerDecorator, MetadataKeys } from "express-controller";
import { deleteKeyPaths } from "../../middlewares";

export const requireDeleteKeyPaths = (
  ...keyPaths: string[]
): RequestHandlerDecorator => use(deleteKeyPaths(keyPaths));
