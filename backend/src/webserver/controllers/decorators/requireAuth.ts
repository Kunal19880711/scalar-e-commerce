import { use, RequestHandlerDecorator } from "express-controller";
import { Roles } from "../../../constants";
import { authMiddleware } from "../../middlewares";

export const requireAuth = (...roles: Roles[]): RequestHandlerDecorator =>
  use(authMiddleware(roles));
