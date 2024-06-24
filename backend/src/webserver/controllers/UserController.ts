import { Request, Response, NextFunction } from "express";
import { controller, get, patch, post, del } from "express-controller";
import { UserModel } from "../../persistence";
import {
  getAllResources,
  createResource,
  getResourceById,
  updateResourceById,
  deleteResourceById,
} from "../webServerUtils";

import { Paths, Roles } from "../../constants";
import { requireAuth } from "./decorators";

const getAllUsers = getAllResources(UserModel);
const getUserById = getResourceById(UserModel);
const createUser = createResource(UserModel);
const updateUserById = updateResourceById(UserModel);
const deleteUserById = deleteResourceById(UserModel);

@controller(Paths.UserApi)
export class UserController {
  @get(Paths.EMPTY)
  @requireAuth(Roles.Admin)
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getAllUsers(req, res, next);
  }

  @get(Paths.ID)
  @requireAuth(Roles.Admin)
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getUserById(req, res, next);
  }

  @post(Paths.EMPTY)
  @requireAuth(Roles.Admin)
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await createUser(req, res, next);
  }

  @patch(Paths.ID)
  @requireAuth(Roles.Admin)
  async updateUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await updateUserById(req, res, next);
  }

  @del(Paths.ID)
  @requireAuth(Roles.Admin)
  async deleteUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await deleteUserById(req, res, next);
  }
}
