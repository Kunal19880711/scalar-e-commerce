import { Request, Response, NextFunction } from "express";
import { IUser, UserModel } from "../../persistence";
import {
  getAllResources,
  createResource,
  getResourceById,
  updateResourceById,
  deleteResourceById,
} from "../utils";
import { controller, get, patch, post, del } from "./decorators";
import { Paths } from "../../constants";

const getAllUsers = getAllResources(UserModel);
const getUserById = getResourceById(UserModel);
const createUser = createResource(UserModel);
const updateUserById = updateResourceById(UserModel);
const deleteUserById = deleteResourceById(UserModel);

@controller(Paths.UserApi)
export class UserController {
  @get(Paths.EMPTY)
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getAllUsers(req, res, next);
  }

  @get(Paths.ID)
  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await getUserById(req, res, next);
  }

  @post(Paths.EMPTY)
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await createUser(req, res, next);
  }

  @patch(Paths.ID)
  async updateUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await updateUserById(req, res, next);
  }

  @del(Paths.ID)
  async deleteUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    return await deleteUserById(req, res, next);
  }
}
