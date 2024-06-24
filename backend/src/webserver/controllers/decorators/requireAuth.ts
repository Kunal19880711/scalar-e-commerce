import { use, RequestHandlerDecorator } from "express-controller";
import { Roles } from "../../../constants";
import { auth } from "../../middlewares";

export const requireAuth = (...roles: Roles[]): RequestHandlerDecorator =>
  use(auth(roles));
